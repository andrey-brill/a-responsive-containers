
const { spa } = require('a-webpack-configs');


module.exports = (env) => spa(env, {

    entryPath: './examples/@src/examples.js',
    productionPath: './docs',
    developmentPath: './examples/spa',

    title: 'RC',

    plugins: {
        css: true,
        babel: true,
        clean: true,
        copy: true
    }
});