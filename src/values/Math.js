

function isCompatible (rv1, rv2) {
    return (
        rv1.isResponsiveObject &&
        rv2.isResponsiveObject &&
        rv1.context === rv2.context &&
        rv1.unit === rv2.unit &&
        rv1.round === rv2.round
    );
}

function clone (obj, value) {
    const o = Object.assign({}, obj);
    o.value = value;
    return o;
}

function is (a, operator, b) {
    switch (operator) {
        case '===': return a === b;
        case '==': return a == b;
        case '<=': return a <= b;
        case '>=': return a >= b;
        case '!=': return a != b;
        case '!==': return a !== b;
        default:
            throw new Error('Unknown operator: ' + operator);
    }
}

export function assignMath (rv) {

    Object.assign(rv, {

        is: (a, operator, b) => {

            const ra = rv(a);
            const rb = rv(b);

            if (isCompatible(ra, rb)) {
                const value = is(ra.value, operator, rb.value);
                return rv(() => value);
            } else {
                return rv(calc => is(calc(ra), operator, calc(rb)));
            }
        },

        plus : (a, b) => {

            const ra = rv(a);
            const rb = rv(b);

            if (isCompatible(ra, rb)) {
                return clone(ra, ra.value + rb.value);
            } else {
                return rv(calc => calc(ra) + calc(rb));
            }
        },

        minus : (a, b) => {

            const ra = rv(a);
            const rb = rv(b);

            if (isCompatible(ra, rb)) {
                return clone(ra, ra.value - rb.value);
            } else {
                return rv(calc => calc(ra) - calc(rb));j
            }
        },

        multiply: (a, b) => {

            const ra = rv(a);
            const rb = rv(b);

            if (isCompatible(ra, rb)) {
                return clone(ra, ra.value * rb.value);
            } else {
                return rv(calc => calc(ra) * calc(rb));
            }
        },

        kx: (k, v) => {

            const r = rv(v);

            if (r.isResponsiveObject) {
                return clone(r, k * r.value);
            } else {
                return rv(calc => k * calc(r));
            }
        },

    });
}
