// ----------------------------------------------------------------------------

function json2xml(json, nested) {
  var xml = '',
      ident = '\n' + ('\t'.repeat(nested));

  for ( var key in json ) {

    if ( Array.isArray( json[key] ) ) {

      xml += ident + '<' + key + '>' +
              json[key]
                .map(function(item) {
                  return json2xml(item, nested + 1);
                })
                .join(ident + '</' + key + '>' + ident + '<' + key + '>') +
             ident + '</' + key + '>';

    } else if ( typeof json[key] === 'object' ) {

      xml += ident + '<' + key + '>' +
             json2xml(json[key], nested + 1) +
             ident + '</' + key + '>';

    } else {

      xml += ident + '<' + key + '>' + json[key] + '</' + key + '>';

    }

  }

  return xml;
}

// ----------------------------------------------------------------------------

function json2txt(json, nested) {  
  var txt = '';

  for ( var key in json ) {
    txt += '\n';
    
    if ( Array.isArray( json[key] ) ) {
      txt += json[key]
                .map(function(item, idx) {
                  return json2txt(item, nested + key + '[' + idx + ']:');
                })
                .filter(Boolean)
                .join('\n');
    } else if ( typeof json[key] === 'object' ) {
      txt += json2txt(json[key], nested + key + ':');
    } else {
      txt += (nested + key + (' '.repeat(96))).substr(0, 96) + ' ' + json[key];
    }

    txt = txt.trim();
  }

  return txt.trim();
}

// ----------------------------------------------------------------------------

function xml2json(xml, tree) {  
  xml = xml.toString().trim();
  
  if (xml.indexOf('<?') == 0) {
    xml = xml.substring(xml.indexOf('?>') + 2);
  }
  
  while(xml.length > 0) {
    var start   = xml.indexOf('<'),
        end     = xml.indexOf('>'),
        tag     = xml.substring(start + 1, end).trim(),
        attr    = tag.match(/(\w+)\s*=\s*((["'])(.*?)\3|(?=\s|\/>))/g),
        name    = (attr === null ? tag : tag.substring(0, tag.indexOf(' '))).trim(),
        cend    = tag[tag.length - 1] === '/' ? -1 : xml.indexOf('</' + name + '>'),
        obj     = {};
        
    if (start === -1) {
      var value = xml.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      value = isNaN(value) ? value.toString() : Number(value); 
      
      if (name === '') {        
        return value;     
      }
      
      tree[name] = value;  
    
      return tree;
    }
    
    if (attr !== null) {
      obj._ = {};
      
      attr.forEach(function(attr) {
        var equal = attr.indexOf('='),
            value = attr.substring(equal + 2, attr.length - 1);
  
        obj._[attr.substring(0, equal)] = isNaN(value) ? value.toString() : Number(value);
      })
    }
    
    if (cend === -1) {
      xml = xml.substring(end + 1);
    } else {
      var sObj = xml2json(xml.substring(end + 1, cend), obj);
      if (sObj !== obj) {
        obj = sObj;
      }
      
      xml = xml.substring(cend + name.length + 3);
    }
    
    if (tree.hasOwnProperty(name)) {
      if (!Array.isArray(tree[name])) {
        tree[name] = [ tree[name] ];        
      }
      
      tree[name].push(obj);
    } else {
      tree[name.replace(/[ /]/g, '')] = obj;      
    }
  }

  return tree;
}

// ----------------------------------------------------------------------------

function txt2json(txt) {
  var json = {}; 
      
  txt.split('\n').forEach(function(line) {    
    var root = json,
        index = line.indexOf(' '),
        path,
        value = '';
    
    if (line.trim() === '') { return null; }

    if (index === -1) {
      path = line;
    } else {
      path = line.substring(0, index).trim();
      value = line.substring(index).trim();
    }

    path.split(':').forEach(function(key, idx, arr) {
      if (key.indexOf('[') > -1) {
        var keyName  = key.split('[')[0],
            keyIndex = key.split('[')[1].split(']')[0];

        if (!root.hasOwnProperty(keyName)) {
          root[keyName] = [];
        }

        if (!root[keyName][keyIndex]) {
          root[keyName][keyIndex] = {}
        }

        root = root[keyName][keyIndex];
      } else {
        if (!root.hasOwnProperty(key)) {
          root[key] = {};
        }

        if (idx === arr.length - 1) {
          root[key] = value;
        } else {
          root = root[key];
        }
      }
    });
  });
  
  return json;
}

// ----------------------------------------------------------------------------

module.exports = {
  json2xml: function(json) { return json2xml(json, 0);               },
  json2txt: function(json) { return json2txt(json, '');              },
  
  xml2json: function(xml)  { return xml2json(xml, {});               }, 
  xml2txt : function(xml)  { return json2txt(xml2json(xml, {}), ''); }, 
  
  txt2json: function(txt)  { return txt2json(txt);                   }, 
  txt2xml : function(txt)  { return json2xml(txt2json(txt), 0);      }
}

// ----------------------------------------------------------------------------