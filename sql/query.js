const log4js = require('log4js');

class Query {
    constructor(conn, table, sqlMaker, option) {
        this.conn = conn;
        this.table = table;
        this.sqlMaker = sqlMaker;
        this.option = option;
    }

    async count() {
        let result = await this.conn.exec([{
            sql: this.sqlMaker.makeCount(this),
            args: this.whereArgValues
        }]);

        if (this.option) {
            this.option.user.addTrace({
                type: 'crud',
                table: this.table,
                op: 'count'
            });
        }

        return result[0]['COUNT (id)'];
    }

    order(...fields) {
        return sort(this, 'asc', ...fields);
    }

    orderByDesc(...fields) {
        return sort(this, 'desc', ...fields);
    }

    skip(skip) {
        this.skipValue = skip;
        return this;
    }


    take(take) {
        this.takeValue = take;
        return this;
    }

    async toArray() {
        let res = await this.conn.exec([{
            sql: this.sqlMaker.makeSelect(this),
            args: this.whereArgValues
        }]);

        if (this.option) {
            this.option.user.addTrace({
                type: 'crud',
                table: this.table,
                op: 'r'
            });
        }

        return res;
    }

    where(sql, ...args) {
        this.whereValue = sql;
        this.whereArgValues = args;
        return this;
    }
}

function sort(self, sortKey, ...fields) {
    if (!self.orderValues)
        self.orderValues = [];
    fields.forEach(r => {
        self.orderValues.push({
            field: r,
            sortKey: sortKey
        });
    });
    return self;
}

module.exports = Query;