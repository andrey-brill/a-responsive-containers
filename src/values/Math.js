
import { rv } from "./Rv";


export function plus (a, b) {

    const ra = rv(a);
    const rb = rv(b);

    if (isCompatible(ra, rb)) {
        return clone(ra, ra.value + rb.value);
    } else {
        return rv(function(calc) {
            return calc(ra) + calc(rb);
        });
    }
}

export function minus (a, b) {

    const ra = rv(a);
    const rb = rv(b);

    if (isCompatible(ra, rb)) {
        return clone(ra, ra.value - rb.value);
    } else {
        return rv(calc => calc(ra) - calc(rb));j
    }
}

export function multiply (a, b) {

    const ra = rv(a);
    const rb = rv(b);

    if (isCompatible(ra, rb)) {
        return clone(ra, ra.value * rb.value);
    } else {
        return rv(calc => calc(ra) * calc(rb));
    }
}

export function kx(k, v) {

    const r = rv(v);

    if (!isFunction(r)) {
        return clone(r, k * r.value);
    } else {
        return rv(calc => k * calc(r));
    }
}

function isCompatible(rv1, rv2) {
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
