class Factory {
    buildRepository() {
        throw new Error('没有重写buildRepository方法');
    }

    buildUow() {
        throw new Error('没有重写buildUow方法');
    }

    db(table, uow, option) {
        let isTx = true;
        if (uow) {
            option = uow.option;
        } else {
            uow = this.uow(option);
            isTx = false;
        }
        return this.buildRepository(table, uow, isTx, option);
    }

    uow(option) {
        return this.buildUow(option);
    }
}

module.exports = Factory;