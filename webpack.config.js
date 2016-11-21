var glob = require("glob");
var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: glob.sync("./resources/js/*.jsx"),
    output: {
        path: path.resolve(__dirname, "public"),
        publicPath: 'public/js/',
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
            }
        ]
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
        )
    ]
};