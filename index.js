function bindCtx(ctx, fn){
  return function(){
    return fn.apply(ctx, arguments);
  }
}

function ensureTable(tableName, tableOptions){
  var r = this;
  var table = r.table(tableName);

  var query = r.tableList().contains(tableName).do(
    r.branch(r.row, table, r.do(function(){
      return r.tableCreate(tableName, tableOptions).do(function(){
        return table;
      });
    }))
  );

  return Object.create(query, {
    run: {
      value: function(){
        query = r.tableList().contains(tableName).do(
          r.branch(r.row, r.object('created', 0), r.do(function(){
            return r.tableCreate(tableName, tableOptions);
          }))
        );
        return query.run.apply(query, arguments);
      }
    }
  });
}

function ensureDb(dbName){
  var r = this;
  var db = r.db(dbName);

  var query = r.dbList().contains(dbName).do(
    r.branch(r.row, db, r.do(function(){
      return r.dbCreate(dbName).do(function(){
        return db;
      });
    }))
  );

  return Object.create(query, {
    run: {
      value: function(){
        query = r.dbList().contains(dbName).do(
          r.branch(r.row, r.object('created', 0), r.do(function(){
            return r.dbCreate(dbName);
          }))
        );
        return query.run.apply(query, arguments);
      }
    }
  })
}

function ensureTables(tables){
  var r = this;
  return r(tables).difference(
    r.tablesList()
  ).forEach(function(tableName){
    return r.tableCreate(tableName);
  }).do(
    r.branch(
      r.row.hasFields('created'), r.row, r.object('created',0)
    )
  );
}

function patch(r){
  r.ensureDb = bindCtx(r, ensureDb);
  r.ensureTable = bindCtx(r, ensureTable);
  r.ensureTables = bindCtx(r, ensureTables);
}

module.exports = patch;