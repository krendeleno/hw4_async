module.exports = function (Homework) {
    const {add, less} = Homework;

    function promisify (fn, ...args) {
        return new Promise((resolve) => {
            fn(...args, res => resolve(res));
        });
    }

    return async function reduce(asyncArray, fn, initialValue, cb) {
        let i = 0;

        let [result, length] = await Promise.all([
            initialValue || promisify(asyncArray.get, 0),
            promisify(asyncArray.length)
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