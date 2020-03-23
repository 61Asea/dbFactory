class UnitOfWork {
    constructor(connPool, option) {
        this.connPool = connPool;
        this.queue = [];
        this.option = option;
    }

    async commit() {
        if (!this.queue.length)
            return;

        let conn = await this.connPool.getConn();
        let tableOfDb = {};
        for (let item of this.queue) {
            let db = tableOfDb[item.table];
            if (!db)
                db = tableOfDb[item.table] = conn.collection(item.table);

            await item.fn(db);
        }
        this.queue = [];
    }

    registerAdd(table, entity) {
        this.queue.push({
            table,
            fn: async db => {
                await db.insertOne(entity);
            }
        });
        if (this.option) {
            this.option.user.addTrace({
                type: 'crud',
                table: table,
                op: 'c'
            });
        }
    }

    registerRemove(table, entity) {
        this.queue.push({
            table,
            fn: async db => {
                await db.deleteOne({
                    id: entity.id
                });
            }
        });
        if (this.option) {
            this.option.user.addTrace({
                type: 'crud',
                table: table,
                op: 'd'
            });
        }
    }

    registerSave(table, entity) {
        this.queue.push({
            table,
            fn: async db => {
                await db.updateOne({
                    id: entity.id
                }, {
                    $set: entity
                });
            }
        });
        if (this.option) {
            this.option.user.addTrace({
                type: 'crud',
                table: table,
                op: 'u'
            });
        }
    }
}

module.exports = UnitOfWork;