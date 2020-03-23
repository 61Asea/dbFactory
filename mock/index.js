const $ = require('underscore');

const BaseFactory = require('../base/factory');
const Repository = require('./repository');
const Uow = require('./uow');

let mockCache = {};

class Factory extends BaseFactory {
    constructor(idAssert) {
        console.log('mock db-factory');
        super();
        this.idAssert = idAssert;
    }

    buildRepository(table, uow, isTx) {
        return new Repository(table, uow, isTx, mockCache);
    }

    buildUow() {
        return new Uow(mockCache, this.idAssert);
    }
};

module.exports = {
    Factory: Factory,
    flushAll: () => {
        $.each(mockCache, r => {
            r.data = [];
        });
    },
    RegisterWhere: (table, whereFunc) => {
        mockCache[table] = mockCache[table] || {
            data: []
        };
        mockCache[table].whereFunc = whereFunc;
    }
};