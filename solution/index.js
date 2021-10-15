module.exports = function (Homework) {

    function getLength(asyncArray) {
        return new Promise(function (resolve, reject) {
            asyncArray.length((res) => resolve(res));
        });
    }

    function getElement(asyncArray, index) {
        return new Promise(function (resolve, reject) {
            asyncArray.get(index, (res) => resolve(res));
        });
    }

    function getLess(value1, value2) {
        return new Promise(function (resolve, reject) {
            Homework.less(value1, value2, (res) => resolve(res));
        });
    }

    function getAdd(value1, value2) {
        return new Promise(function (resolve, reject) {
            Homework.add(value1, value2, (res) => resolve(res));
        });
    }

    return (array, fn, initialValue, cb) => {
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