class Uow {
    constructor(conn, sqlMaker, option) {
        this.conn = conn;
        this.queue = [];
        this.sqlMaker = sqlMaker;
        this.option = option;
    }

    async commit() {
        if (!this.queue.length)
            return;

        await this.conn.exec(this.queue);
        this.queue = [];
    }

    registerAdd(table, entity) {
        this.queue.push(
            this.sqlMaker.makeAdd(table, entity)
        );
        if (this.option) {
            this.option.user.addTrace({
                type: 'crud',
                table: table,
                op: 'c'
            });
        }
    }

    registerRemove(table, entity) {
        this.queue.push(
            this.sqlMaker.makeRemove(table, entity)
        );
        if (this.option) {
            this.option.user.addTrace({
                type: 'crud',
                table: table,
                op: 'd'
            });
        }
    }

    registerSave(table, entity) {
        this.queue.push(
            this.sqlMaker.makeSave(table, entity)
        );
        if (this.option) {
            this.option.user.addTrace({
                type: 'crud',
                table: table,
                op: 'u'
            });
        }
    }
}

module.exports = Uow;