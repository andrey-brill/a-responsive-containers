

const diagonalApproximationK = 1.5;

export function isSmallScreen (d) {
    return d <= 9 * diagonalApproximationK;
}

export function isTabletOrMobile (d) {
    return d <= 12 * diagonalApproximationK;
}

export function rcResize ({ width, height, diagonal }) {

    // small screen
    if (isSmallScreen(diagonal)) {
        return { width, height: Math.max(width, height) }; // horizontal mode is "zooming" mode
    }

    // big screen
    const ratio = width / height;
    const k = ratio >= 1.55 ? 1 : 0.8;
    return { width: Math.min(width, Math.ceil(k * height)), height };
}
