import test from './helpers/';

describe('transform', function() {
    describe('simple component', function() {
        it('single layer', function() {
            return test({
                path: 'simple/single-layer/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js'
                            }
                        }
                    ]
                }
            });
        });

        it('cache', function() {
            return test({
                path: 'simple/cache/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js'
                            }
                        }
                    ]
                }
            });
        });

        it('exclude', function() {
            return test({
                path: 'simple/exclude/',
                test: 'test/index.js',
                options: {
                    layers: []
                }
            });
        });

        describe('multiple layers', function() {
            it('nearest', function() {
                return test({
                    path: 'simple/multiple-layers/nearest/',
                    test: 'layer-1/test/index.js',
                    options: {
                        layers: [
                            {
                                path: 'layer-0/',
                                files: {
                                    main: 'index.js'
                                }
                            },
                            {
                                path: 'layer-1/',
                                files: {
                                    main: 'index.js'
                                }
                            }
                        ]
                    }
                });
            });

            it('through', function() {
                return test({
                    path: 'simple/multiple-layers/through/',
                    test: 'layer-1/test/index.js',
                    options: {
                        layers: [
                            {
                                path: 'layer-0/',
                                files: {
                                    main: 'index.js'
                                }
                            },
                            {
                                path: 'layer-1/',
                                files: {
                                    main: 'index.js'
                                }
                            }
                        ]
                    }
                });
            });

            it('middle', function() {
                return test({
                    path: 'simple/multiple-layers/middle/',
                    test: 'layer-1/test/index.js',
                    options: {
                        layers: [
                            {
                                path: 'layer-0/',
                                files: {
                                    main: 'index.js'
                                }
                            },
                            {
                                path: 'layer-1/',
                                files: {
                                    main: 'index.js'
                                }
                            },
                            {
                                path: 'layer-2/',
                                files: {
                                    main: 'index.js'
                                }
                            }
                        ]
                    }
                });
            });

            it('self', function() {
                return test({
                    path: 'simple/multiple-layers/self/',
                    test: 'layer-1/target/index.js',
                    options: {
                        layers: [
                            {
                                path: 'layer-0/',
                                files: {
                                    main: 'index.js'
                                }
                            },
                            {
                                path: 'layer-1/',
                                files: {
                                    main: 'index.js'
                                }
                            }
                        ]
                    }
                });
            });

            it('self middle', function() {
                return test({
                    path: 'simple/multiple-layers/self-middle/',
                    test: 'layer-1/target/index.js',
                    options: {
                        layers: [
                            {
                                path: 'layer-0/',
                                files: {
                                    main: 'index.js'
                                }
                            },
                            {
                                path: 'layer-1/',
                                files: {
                                    main: 'index.js'
                                }
                            },
                            {
                                path: 'layer-2/',
                                files: {
                                    main: 'index.js'
                                }
                            }
                        ]
                    }
                });
            });
        });
    });

    describe('error', function() {
        it('not found', function() {
            return test({
                path: 'error/not-found/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js'
                            }
                        }
                    ]
                }
            })
            .catch(function(err) {
                if (err.message !== 'Component "#target" was not found.') {
                    throw new Error(err.message);
                }
            });
        });

        it('self not found', function() {
            return test({
                path: 'error/self-not-found/',
                test: 'layer-0/target/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js'
                            }
                        }
                    ]
                }
            })
            .catch(function(err) {
                if (err.message !== 'Component "#target" was not found.') {
                    throw new Error(err.message);
                }
            });
        });

        it('no hash-requires', function() {
            return test({
                path: 'error/no-hash/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js'
                            }
                        }
                    ]
                }
            });
        });

        it('only styles', function() {
            return test({
                path: 'error/only-styles/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js',
                                styles: 'styles.less'
                            }
                        }
                    ]
                }
            })
            .catch(function(err) {
                if (err.message !== 'Component "#target" was not found.') {
                    throw new Error(err.message);
                }
            });
        });
    });

    describe('component with styles', function() {
        it('single layer', function() {
            return test({
                path: 'with-styles/single-layer/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js',
                                styles: 'styles.less'
                            }
                        }
                    ]
                }
            });
        });

        it('multiple layers', function() {
            return test({
                path: 'with-styles/multiple-layers/',
                test: 'layer-1/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js',
                                styles: 'styles.less'
                            }
                        },
                        {
                            path: 'layer-1/',
                            files: {
                                main: 'index.js',
                                styles: 'styles.less'
                            }
                        }
                    ]
                }
            });
        });
    });

    describe('?styles', function() {
        it('simple', function() {
            return test({
                path: '?styles/simple/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js',
                                styles: 'styles.less'
                            }
                        }
                    ]
                }
            });
        });

        it('error', function() {
            return test({
                path: '?styles/error/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js',
                                styles: 'styles.less'
                            }
                        }
                    ]
                }
            })
            .catch(function(err) {
                if (err.message !== 'Styles for component "#target?styles" were not found.') {
                    throw new Error(err.message);
                }
            });
        });
    });

    describe('?class', function() {
        it('simple', function() {
            return test({
                path: '?class/simple/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js'
                            }
                        }
                    ]
                }
            });
        });

        it('with styles', function() {
            return test({
                path: '?class/with-styles/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js',
                                styles: 'styles.less'
                            }
                        }
                    ]
                }
            });
        });

        it('exportFactory = false', function() {
            return test({
                path: '?class/export-factory/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js'
                            }
                        }
                    ],
                    exportFactory: false
                }
            });
        });
    });

    describe('?inject', function() {
        it('simple', function() {
            return test({
                path: '?inject/simple/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js'
                            }
                        }
                    ],
                    injectable: true
                }
            });
        });

        it('with styles', function() {
            return test({
                path: '?inject/with-styles/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js',
                                styles: 'styles.less'
                            }
                        }
                    ],
                    injectable: true
                }
            });
        });

        it('no injects', function() {
            return test({
                path: '?inject/no-injects/simple/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js'
                            }
                        }
                    ],
                    injectable: true
                }
            });
        });

        it('no injects + exportFactory: false', function() {
            return test({
                path: '?inject/no-injects/export-factory/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js'
                            }
                        }
                    ],
                    exportFactory: false,
                    injectable: true
                }
            });
        });

        it('?class', function() {
            return test({
                path: '?inject/?class/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js'
                            }
                        }
                    ],
                    injectable: true
                }
            });
        });

        it('?styles', function() {
            return test({
                path: '?inject/?styles/',
                test: 'layer-0/test/index.js',
                options: {
                    layers: [
                        {
                            path: 'layer-0/',
                            files: {
                                main: 'index.js',
                                styles: 'styles.less'
                            }
                        }
                    ],
                    injectable: true
                }
            });
        });
    });
});
