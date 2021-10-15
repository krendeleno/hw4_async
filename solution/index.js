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
            let result = initialValue;
            let length = await getLength(asyncArray).then((res) => res);
            let i = 0;
            while (await getLess(i, length).then((res) => res)) {
                let element = await getElement(asyncArray, i).then((res) => res);
                result = await new Promise(function (resolve) {
                    fn(result, element, i, asyncArray,(res) => resolve(res))
                });
                i = await getAdd(i, 1).then((res) => res);
            }
            resolve(result);
        }).then(cb)
    }
}