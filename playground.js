((global) => {
    const _wrap = (fn, cb) => {
        setTimeout(() => {
            cb(fn());
        }, Math.random() * 20);
    };

    const AsyncArray = function (initial) {
        if (initial && !(initial instanceof Array)) {
            throw new Error('initial value is not an array');
        }

        const a = initial ? Array.from(initial) : [];

        this.set = (index, value, cb) => _wrap(() => {
            a[index] = value
        }, cb);
        this.push = (value, cb) => _wrap(() => {
            a.push(value)
        }, cb);

        this.get = (index, cb) => _wrap(() => a[index], cb);
        this.pop = (cb) => _wrap(() => a.pop(), cb);
        this.length = (cb) => _wrap(() => a.length, cb);

        this.print = () => {
            console.log(a.toString());
        };
    }

    const add = (a, b, cb) => _wrap(() => a + b, cb);
    const subtract = (a, b, cb) => _wrap(() => a - b, cb);
    const multiply = (a, b, cb) => _wrap(() => a * b, cb);
    const divide = (a, b, cb) => _wrap(() => a / b, cb);

    const less = (a, b, cb) => _wrap(() => a < b, cb);
    const equal = (a, b, cb) => _wrap(() => a == b, cb);
    const lessOrEqual = (a, b, cb) => _wrap(() => a <= b, cb);

    global.Homework = {
        AsyncArray,
        add,
        subtract,
        multiply,
        divide,
        less,
        equal,
        lessOrEqual,
    };

    Object.freeze(global.Homework);
})(typeof window === 'undefined' ? global : window);

const {AsyncArray, add, subtract, multiply, divide, less, equal, lessOrEqual} = Homework;

const a = new AsyncArray([1, 2, 3]);

a.push(4, () => {
    console.log('добавление элемента выполнено');
    a.print();

    a.set(2, 999, () => {
        console.log('присваивание элемента по индексу выполнено');
        a.print();

        a.get(0, (result) => {
            console.log('получение элемента по индексу выполнено, результат', result);
            a.print();

            a.pop((result) => {
                console.log('получение последнего элемента выполнено, результат', result);
                a.print();

                a.length((result) => {
                    console.log('получение длины массива выполнено, результат', result);
                    a.print();
                });
            });
        });
    });
});

add(5, 2, (result) => console.log('результат сложения', result));

subtract(11, 7, (result) => console.log('результат вычитания', result));

multiply(6, 7, (result) => console.log('результат умножения', result));

divide(13, 7, (result) => console.log('результат деления', result));

less(5, 3, (result) => console.log('результат операции МЕНЬШЕ', result));

equal(1, 1, (result) => console.log('результат операции РАВНО', result));

lessOrEqual(12, 19, (result) => console.log('результат операции МЕНЬШЕ ИЛИ РАВНО', result));

const asyncArray = new Homework.AsyncArray([2, 2, 3, 4]);
const reducerSum = (acc, curr, i, src, cb) => Homework.add(acc, curr, cb);

reduce(asyncArray, reducerSum, undefined, (res) => {
    console.log(res); // 10
});

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


function reduce(asyncArray, fn, initialValue, cb) {
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
