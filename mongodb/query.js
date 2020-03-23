class Query {
    constructor(connPool, table, option) {
        this.connPool = connPool;
        this.table = table;
        this.orderValues = [];
        this.option = option;
    }

    async count() {
        let conn = await this.connPool.getConn();
        let count = await conn.collection(this.table).find(this.whereSelector).count();

        if (this.option) {
            this.option.user.addTrace({
                type: 'crud',
                table: this.table,
                op: 'count'
            });
        }

        return count;
    }

    order(...fields) {
        fields.forEach(v => {
            this.orderValues.push([v, 1]);
        });
        return this;
    }

    orderByDesc(...fields) {
        fields.forEach(v => {
            this.orderValues.push([v, -1]);
        });
        return this;
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
        let conn = await this.connPool.getConn();
        let cursor = await conn.collection(this.table).find(this.whereSelector);
        if (this.orderValues)
            cursor.sort(this.orderValues);
        if (this.skipValue)
            cursor.skip(this.skipValue);
        if (this.takeValue)
            cursor.limit(this.takeValue);
        let res = await cursor.toArray();

        if (this.option) {
            this.option.user.addTrace({
                type: 'crud',
                table: this.table,
                op: 'r'
            });
        }

        return res;
    }

    where(selector) {
        this.whereSelector = selector;
        return this;
    }
};

module.exports = Query;