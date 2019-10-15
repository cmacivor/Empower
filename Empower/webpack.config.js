const path = require('path');

module.exports = {
    mode: 'development',
    entry: './wwwroot/source/app.js',
    output: {
        path: path.resolve(__dirname, 'wwwroot/dist'),
        filename: 'AdminTypeBundle.js',
        publicPath: 'dist/'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                         '@babel/preset-react',
                         '@babel/preset-env',
                         {
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/transform-runtime'
                            ]
                         }
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ],
            }
        ]
    }
};