var glob = require("glob");
var path = require("path");
var webpack = require("webpack");

process.env.NODE_ENV = 'development';
process.env.PUBLIC_URL = '';

module.exports = {
    entry: glob.sync("./src/*.jsx"),
    output: {
        path: path.resolve(__dirname, "public"),
        publicPath: 'public/',
        filename: 'app.js'
    },
    resolve: {
        modulesDirectories: ["node_modules", "bower_components"]
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.sass$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }            
        ]
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
        ),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || 'public'),
        }),
    ]
};