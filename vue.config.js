const webpack = require("webpack");

module.exports = {
    baseUrl: process.env.BASE_URL || '/',
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                BASE_URL: JSON.stringify(process.env.BASE_URL || '/')
            })
        ]
    }
};