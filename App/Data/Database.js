const sqlite3 = require('sqlite3').verbose();

module.exports = class Database{
    constructor(fileName){
        this.Store = new sqlite3.Database(fileName);
    }
}

