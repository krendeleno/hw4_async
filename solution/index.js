module.exports = function (Homework) {
    const {AsyncArray, add, subtract, multiply, divide, less, equal, lessOrEqual} = Homework;

    function getLength(asyncArray) {
        return new Promise(function (resolve) {
            asyncArray.length((res) => resolve(res));
        });
    }

    function getElement(asyncArray, index) {
        return new Promise(function (resolve) {
            asyncArray.get(index, (res) => resolve(res));
        });
    }

    function getLess(value1, value2) {
        return new Promise(function (resolve) {
            less(value1, value2, (res) => resolve(res));
        });
    }

    function getAdd(value1, value2) {
        return new Promise(function (resolve) {
            add(value1, value2, (res) => resolve(res));
        });
    }

    return (asyncArray, fn, initialValue, cb) => {
        new Promise(async function (resolve) {
            let i = 0;

            let [result, length] = await Promise.all([
                initialValue || getElement(asyncArray, 0),
                getLength(asyncArray)
            ])

            if (!initialValue)
                i = 1;
            while (await getLess(i, length)) {
                let element = await getElement(asyncArray, i);
                result = await new Promise(function (resolve) {
                    fn(result, element, i, asyncArray, (res) => resolve(res))
                });
                i = await getAdd(i, 1);
            }
            resolve(result);
        }).then(cb)
    }
}