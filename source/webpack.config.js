const path = require('path')
module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js',
        workout: './src/workoutIndex.js'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name]Bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }]
    },
    resolve: {
        extensions: ['.js']
    }
}
