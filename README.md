# xml2json2txt

## This mini tool with zero dependences and <200 lines of code, can convert data between XML, JSON and TXT and viseversa.

Is good for comunicate between multiple platforms heterogeneous, for example Cobol (TXT) <-> Node.js/Browser (JSON) <-> SOAP/REST API (XML).

Tested in production, working on.

## Some examples...

```javascript
const convert = require('xml2json2txt');

console.log(convert.json2xml({ hello: 'world', somedata: [ { name: 'Alice', foo: 'bar' }, { name: 'Bob', bar: 'foo' } ] }));

/*
  <hello>world</hello>
  <somedata>
    <name>Alice</name>
    <foo>bar</foo>
  </somedata>
  <somedata>
    <name>Bob</name>
    <bar>foo</bar>
  </somedata>
*/

console.log(convert.json2txt({ hello: 'world', somedata: [ { name: 'Alice', foo: 'bar' }, { name: 'Bob', bar: 'foo' } ] }));

/*
  hello               world
  somedata[0]:name    Alice
  somedata[0]:foo     bar
  somedata[1]:name    Bob
  somedata[1]:bar     foo
*/

console.log(convert.xml2json('<country>' +
                               '<people>' +
                                  '<name>Bob</name>' +
                                  '<gender>male</gender>' +
                                  '</people>' +
                                '<people>' +
                                  '<name>Alice</name>' +
                                  '<gender>female</gender>' +
                                '</people>' +
                              '</country>'));

/*
  { country:
     { people:
        [ { name: 'Bob', gender: 'male' },
          { name: 'Alice', gender: 'female' } ] } }
*/        

console.log(convert.xml2txt('<country>' +
                               '<people>' +
                                  '<name>Bob</name>' +
                                  '<gender>male</gender>' +
                                  '</people>' +
                                '<people>' +
                                  '<name>Alice</name>' +
                                  '<gender>female</gender>' +
                                '</people>' +
                              '</country>'));

/*  
  country:people[0]:name    Bob
  country:people[0]:gender  male
  country:people[1]:name    Alice
  country:people[1]:gender  female
*/        

console.log(convert.txt2json('service               Soap\n' +
                             'auth:token            abc\n' +
                             'auth:secret           cde\n' +
                             'data:name             Bob\n' +
                             'data:age              27\n' +
                             'data:roles[0]:name    Admin\n' +
                             'data:roles[1]:name    Tester\n'
                            ));
                            
/*
  { service: 'Soap',
    auth: { token: 'abc', secret: 'cde' },
    data:
     { name: 'Bob',
       age: '27',
       roles: [ { name: 'Admin' }, { name: 'Tester' } ] } }
*/
                          
console.log(convert.txt2xml('service                Soap\n' +
                             'auth:token            abc\n' +
                             'auth:secret           cde\n' +
                             'data:name             Bob\n' +
                             'data:age              27\n' +
                             'data:roles[0]:name    Admin\n' +
                             'data:roles[1]:name    Tester\n'
                            ));
/*
  <service>Soap</service>
  <auth>
    <token>abc</token>
    <secret>cde</secret>
  </auth>
  <data>
    <name>Bob</name>
    <age>27</age>
    <roles>
      <name>Admin</name>
    </roles>
    <roles>
      <name>Tester</name>
    </roles>
  </data>
*/

```