

export class SuffixKeys {

    constructor (keys) {
        this.keys = keys;
    }

    resolve (sourceString) {

        for (let key of this.keys) {
            if (sourceString.indexOf(key) >= 0) {
                return key;
            }
        }

        return null;
    }

    containsIn (sourceString) {
        return !!this.resolve(sourceString);
    }

    static buildSuffixRegEx (...suffixes) {
        const patterns = suffixes.map(s => '(' + s.keys.join('|') + ')?');
        return new RegExp(`^${patterns.join('')}$`); // RegExp must be without 'g' flag
    }
}