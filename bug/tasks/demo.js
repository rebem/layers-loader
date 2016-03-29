const host = '127.0.0.1';

export default params => input => {
    return function demo(log) {
        const path = require('path');
        const webpack = require('webpack');
        const WebpackDevServer = require('webpack-dev-server');
        const HtmlWebpackPlugin = require('html-webpack-plugin');

        const config = {
            cache: true,
            stats: {
                colors: true,
                reasons: false
            },
            output: {
                pathinfo: true,
                path: path.resolve('./'),
                publicPath: '/',
                filename: 'bundle.js'
            },
            entry: [
                'webpack/hot/dev-server',
                './demo/index'
            ],
            module: {
                preLoaders: [
                    {
                        test: /\.js$/,
                        loader: 'rebem-layers',
                        query: {
                            layers: [
                                require('rebem-core-components'),
                                {
                                    path: path.resolve('src/'),
                                    files: {
                                        main: 'index.js'
                                    }
                                },
                                {
                                    path: path.resolve('demo/components/'),
                                    files: {
                                        main: 'index.js'
                                    }
                                }
                            ],
                            importFactory: true,
                            consumers: [
                                path.resolve('demo/index')
                            ]
                        }
                    },
                    {
                        test: /\.js$/,
                        exclude: [
                            path.resolve('node_modules/')
                        ],
                        loader: 'babel',
                        query: {
                            cacheDirectory: true
                        }
                    }
                ]
            },
            plugins: [
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NoErrorsPlugin(),
                new HtmlWebpackPlugin({
                    template: 'demo/assets/index.html'
                })
            ]
        };

        const server = new WebpackDevServer(webpack(config), {
            hot: true,
            stats: {
                colors: true,
                children: false,
                assets: false,
                version: false,
                hash: false,
                chunkModules: false
            }
        });

        return new Promise(function(resolve, reject) {
            server.listen(params.port, err => {
                if (err) {
                    return reject(err);
                }

                resolve(`http://${host}:${params.port}/webpack-dev-server/`);
            });
        });
    };
};
