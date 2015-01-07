rethinkdb-ensure
================

helps with ensuring existence of dbs and tables

install
-------

there is no npm package for it

```bash
npm install --save YChebotaev/rethinkdb-ensure
```

usage
-----

```javascript
var r = require('rethinkdb');
require('rethinkdb-ensure')(r); // Monkey-patching

r.connect({db:'test'}, function(err, conn){
  r.ensureDb('test', function(err, result){
    // result may be {created:1} or {created:0}
    // at this point db `test` is created
    var tableOptions = {primaryKey: 'id'};
    // if table exists, `tableOptions` will be ignored
    r.ensureTable('test_table', tableOptions).run(conn, function(err, result){
      // result may be {created:1} or {created:0}
    });
  });
});

```

`r.ensureTables`
--------------

table options not supported

```javascript
r.ensureTables(['foo','bar']).run(conn, function(err, results){
  // results may be {created:2}, where `created` is number of created tables
});
```

caveats
-------

this monkey-patch is not comprehensive, it affects only `r` that passed to module function, and creates only two methods `r.ensureDb` and `r.ensureTable`

results of this methods are `RDBOp` instances with overrided `.run` method

you can call `r.ensureTable` only if connection already has default `db` option

for example, this code are **not** working:

```javascript
r.db('test').ensureTable('test_table'); // will produce error
```
