

export class Suffixes {

    constructor (defaultName, suffixes) {
        this.defaultName = defaultName;
        this.suffixes = suffixes;
        this.shortNames = Object.keys(suffixes);
    }

    resolve (sourceString) {

        for (let shortName of this.shortNames) {
            if (sourceString.indexOf(shortName) >= 0) {
                return this.suffixes[shortName];
            }
        }

        return this.defaultName;
    }

    resolveSeparately (result, sourceString) {
        for (let shortName of this.shortNames) {
            if (sourceString.indexOf(shortName) >= 0) {
                result[this.suffixes[shortName]] = shortName;
            }
        }
    }

    static buildSuffixRegEx (...suffixes) {
        const patterns = suffixes.map(s => '(' + s.shortNames.join('|') + ')?');
        return new RegExp(`^${patterns.join('')}$`); // RegExp must be without 'g' flag
    }
}