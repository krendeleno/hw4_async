module.exports = function (Homework) {
    const {AsyncArray, add, subtract, multiply, divide, less, equal, lessOrEqual} = Homework;

    function promisify (fn, ...args) {
        return new Promise((resolve) => {
            fn(...args, res => resolve(res));
        });
    }

    async function reduce(asyncArray, fn, initialValue, cb) {
        let i = 0;

        let [result, length] = await Promise.all([
            initialValue || await promisify(asyncArray.get, 0),
            await promisify(asyncArray.length)
        ])

        if (!initialValue)
            i = 1;
        while (await promisify(less, i, length)) {
            let element = await promisify(asyncArray.get, i);
            result = await promisify(fn, result, element, i, asyncArray);
            i = await promisify(add, i, 1);
        }
        cb(result);
    }
}