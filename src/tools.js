const workingObjects = [];
const internalConfig = {
    replaceArray: false,
};

export function deepExtend(dest, ...sources) {
    if (!dest) {
        dest = {};
    }

    function copy(key, value) {
        if (value && typeof value === 'object') {
            const valueArray = Array.isArray(value);
            let init = dest[key];
            let resetInit = !init || typeof init !== 'object'
                || (valueArray && internalConfig.replaceArray)
                || Array.isArray(init) !== valueArray;

            if (resetInit) {
                if (valueArray) {
                    init = [];
                } else {
                    init = {};
                }
            }
            if (workingObjects.includes(value)) {
                // keep old value
                return;
            }
            workingObjects.push(value);
            deepExtend(init, value);
            workingObjects.pop();
            dest[key] = init;
        } else {
            /* should be primitive */
            dest[key] = value;
        }
    }

    sources.forEach((source) => {
        for (let [key, value] of Object.entries(source)) {
            copy(key, value);
        }
    });

    return dest;
}

deepExtend.replaceArray = function(...args) {
    internalConfig.replaceArray = true;
    const result =  deepExtend(...args);
    internalConfig.replaceArray = false;
    return result;
};

export function __testDeepExtend() {
    /* eslint-disable no-console */

    const a = { s: 'simple', n: null, b: { c: 42 }, arr: [1, 2, {a: 5}, { a: 23 }] };
    const b = { a: a, b: { d: -42 }, arr: [-1, { hoho: 'cool' }, 0, { b: 23 }, 'suite'] };
    const c = { b: { c: 0, e: 'new'}, arr: [0], n: 123 };

    console.info('create A1');
    const A1 = deepExtend({}, a);
    A1.s = 42;
    A1.toto = 'toto';
    console.assert(A1 !== a, 'different object');
    console.assert(a.s === 'simple', 'keep proprty');
    console.assert(A1.s === 42, 'copy simple property');
    console.assert(A1.b.c === 42, 'copy deep property');
    console.assert(A1.arr[0] === 1, 'copy array property');
    console.assert(A1.arr[3].a === 23, 'copy array nested property');
    console.assert(A1.n === null, 'copy null');

    console.info('create A2');
    const A2 = deepExtend(A1, a);
    console.assert(A2.s === 'simple', 'copy property to dest object');
    console.assert(A1.s === 'simple', 'copy property to result object');
    console.assert(A1.toto === 'toto', 'keep own property');
    console.assert(A2 === A1);

    console.info('create B1');
    const B1 = deepExtend({}, a, b);
    console.assert(a.s === 'simple', 'Do not modify source property');
    console.assert(B1.s === 'simple', 'copy source1 property');
    console.assert(B1.a !== a, 'copy reference');
    console.assert(B1.a.s === 'simple', 'copy source2 property');
    console.assert(B1.b.c === 42, 'copy source1 nested property');
    console.assert(B1.b.d === -42, 'copy source2 nested property');
    console.assert(B1.arr[0] === -1, 'keep last source Attr');
    console.assert(B1.arr[1].hoho === 'cool', 'keep last source Obj Attr');
    console.assert(B1.arr[2] === 0, 'keep last source primitive Attr');
    console.assert(B1.arr[3].a === 23, 'keep first source nested Attr');
    console.assert(B1.arr[3].b === 23, 'keep second source nested Attr');
    console.assert(B1.arr[4] === 'suite', 'add Attr');

    console.info('create C1');
    const C1 = deepExtend({}, a, b, c);
    console.assert(C1.b.c === 0, 'copy source3 nested property');
    console.assert(C1.b.d === -42, 'keep source2 nested property');
    console.assert(C1.b.e === 'new', 'add source3 nested property');
    console.assert(C1.arr[0] === 0, 'keep source3 Attr');
    console.assert(C1.arr.length === 5, 'keep array to maximum length');
    console.assert(C1.n === 123, 'replace null value');

    console.info('create C2');
    const C2 = deepExtend.replaceArray({}, a, b, c);
    console.assert(C2.b.c === 0, 'copy as normal source3 nested property');
    console.assert(C2.b.d === -42, 'keep as normal source2 nested property');
    console.assert(C2.b.e === 'new', 'add as normal source3 nested property');
    console.assert(C2.arr[0] === 0, 'keep as normal source3 Attr');
    console.assert(C2.arr.length === 1, 'replace array to last definition');

    console.info('Finish!');

    /* eslint-enable no-console */
}
