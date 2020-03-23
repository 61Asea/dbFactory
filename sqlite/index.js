const Conn = require('./conn');
const BaseFactory = require('../base/factory');
const Repository = require('../sql/repository');
const SqlMaker = require('../sql/sql-maker');
const Uow = require('../sql/uow');

class Factory extends BaseFactory {
    constructor(cfg) {
        super();
        
        this.sqlMaker = new SqlMaker(-1, -1);
        this.conn = new Conn(cfg);
    }
    
    buildRepository(table, uow, isTx, option) {
        return new Repository(this.conn, table, uow, isTx, this.sqlMaker, option);
    }

    buildUow(option) {
        return new Uow(this.conn, this.sqlMaker, option);
    }

    close() {
        return new Promise(s => {
            this.conn.db.close(() => {
                s();
            });
        });
    }
}

module.exports = Factory;