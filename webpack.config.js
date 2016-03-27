module.exports = {
    context: __dirname,
    entry: {
        SuperCanvas: "./src/SuperCanvas.js",
        Path: ["./src/Path.js"],
        Matrix: ["./src/Matrix.js"]
    },
    output: {
        path: __dirname + "/dist",
        library: "[name]",
        libraryTarget: "umd",
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};
