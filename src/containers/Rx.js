

/** Don't touch! 99% magic is here! */
function rxK (diagonalInch) {
    return 4 * Math.pow(diagonalInch - 1.5, 0.1) + 0.15 * diagonalInch - 1.5;
};

export function calcDiagonal (width, height, inch) {
    return Math.sqrt(width * width + height * height) / inch;
}

export function calcRx (width, height, inch) {
    return rxK(calcDiagonal(width, height, inch));
}
