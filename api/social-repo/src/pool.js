const pg = require('pg');

class Pool {
  _pool = null;
  
  create(options) {
    this._pool = new pg.Pool(options);
  }
}

modules.exports = new Pool();
