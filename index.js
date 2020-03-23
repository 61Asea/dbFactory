const Accessor = require('./accessor');

let accessor = new Accessor();

exports.db = (table, uow, option) => {
    return accessor.get().db(table, uow, option);
};

exports.get = name => {
    return accessor.get(name);
};

exports.set = (name, instance) => {
    accessor.set(name, instance);
};

exports.uow = option => {
    return accessor.get().uow(option);
};