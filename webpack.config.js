const nodeExternals = require("webpack-node-externals");

const webpackConfig = {
    mode: "development",
    name: "server",
    target: "node",
    entry: {
        index: './src/index.ts',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist',
    },
    devtool: process.env.production === true ? undefined : "inline-source-map",
    externals: [
        nodeExternals(),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [
            ".ts",
            ".ts",
            ".js",
        ],
    }
};
module.exports = webpackConfig;
