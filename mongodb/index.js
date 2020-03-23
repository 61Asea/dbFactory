const ConnPool = require('./conn-pool');
const Repository = require('./repository');
const Uow = require('./uow');
const BaseFactory = require('../base/factory');

class Factory extends BaseFactory {
    constructor(cfg) {
        super();

        this.connPool = new ConnPool(cfg.url, cfg.dbName);
    }

    buildRepository(table, uow, isTx, option) {
        return new Repository(this.connPool, table, uow, isTx, option);
    }

    buildUow(option) {
        return new Uow(this.connPool, option);
    }

    async close() {
        await this.connPool.client.close();
    }
}

module.exports = Factory;