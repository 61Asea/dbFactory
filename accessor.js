const $ = require('underscore');

const DEFAULT_KEY = 'default';

class Accessor {
    constructor() {
        this.hash = {};
    }

    get(k) {
        if (!k)
            k = DEFAULT_KEY;
        let has = this.has(k);
        if (has)
            return this.hash[k];

        throw new Error(`Register: ${k}`);
    }

    getOrSet(k, v) {
        let has = this.has(k);
        if (has)
            return this.hash[k];

        return (this.hash[k] = v);
    }

    has(k) {
        return $.has(this.hash, k);
    }

    set(k, v) {
        if (!v) {
            v = k;
            k = DEFAULT_KEY;
        }

        this.hash[k] = v;
    }

    tryGet(k) {
        return this.hash[k || DEFAULT_KEY];
    }
}

module.exports = Accessor;