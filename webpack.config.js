const path = require("path")
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname, "src/app.ts"), //path to the main .ts file
    output: {
        filename: "js/main.js", //name for the js file that is created/compiled in memory
        clean: true,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
        host: "0.0.0.0",
        port: 8080, //port that we're using for local host (localhost:8080)
        static: path.resolve(__dirname, "public"), //tells webpack to serve from the public folder
        hot: true,
        devMiddleware: {
            publicPath: "/",
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|obj|glb|gltf|babylon)$/i,
                type: "asset"
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "public/", to: "." }
            ]
        })
    ],
    mode: "development"
}
