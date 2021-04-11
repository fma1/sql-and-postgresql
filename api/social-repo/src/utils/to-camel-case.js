const camelCase = require('camelcase');

module.exports = (rows) => {
    return rows.map(row => {
        /*
         * Alternative to
         * const parsedRows = {};
         * for (let key in row) { ... }
         */
        const reduceFunc = (accObj, currKey) => {
            accObj[camelCase(currKey)] = row[currKey];
            return accObj;
        };

        return Object.keys(row).reduce(reduceFunc, {});
    });
}