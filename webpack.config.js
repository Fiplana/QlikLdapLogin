const nodeExternals = require("webpack-node-externals");
const CopyPlugin = require("copy-webpack-plugin");

const webpackConfig = {
    mode: "development",
    name: "server",
    target: "node",
    entry: {
        index: './src/QlikLdapLoginService.ts',
    },
    output: {
        filename: 'index.js',
        path: __dirname + '/dist',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    },
    devtool: process.env.NODE_ENV === "production" ? undefined : "cheap-source-map",
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
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/static", to: "static" },
            ]
        })
    ]
};
module.exports = webpackConfig;
