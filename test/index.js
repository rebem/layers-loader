import test from './helpers/';

describe('transform', function() {
    describe('simple component', function() {
        it('single layer', function(done) {
            test({
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
            })
            .then(done)
            .catch(done);
        });

        it('cache', function(done) {
            test({
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
            })
            .then(done)
            .catch(done);
        });

        it('exclude', function(done) {
            test({
                path: 'simple/exclude/',
                test: 'test/index.js',
                options: {
                    layers: []
                }
            })
            .then(done)
            .catch(done);
        });

        describe('multiple layers', function() {
            it('nearest', function(done) {
                test({
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
                })
                .then(done)
                .catch(done);
            });

            it('through', function(done) {
                test({
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
                })
                .then(done)
                .catch(done);
            });

            it('middle', function(done) {
                test({
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
                })
                .then(done)
                .catch(done);
            });

            it('self', function(done) {
                test({
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
                })
                .then(done)
                .catch(done);
            });
        });
    });

    describe('error', function() {
        it('not found', function(done) {
            test({
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
            .then(done)
            .catch(function(err) {
                if (err.message === 'Component "#target" was not found.') {
                    return done();
                }

                done(err);
            });
        });

        it('self not found', function(done) {
            test({
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
            .then(done)
            .catch(function(err) {
                if (err.message === 'Component "#target" was not found.') {
                    return done();
                }

                done(err);
            });
        });

        it('no hash-requires', function(done) {
            test({
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
            })
            .then(done)
            .catch(done);
        });

        it('only styles', function(done) {
            test({
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
            .then(done)
            .catch(function(err) {
                if (err.message === 'Component "#target" was not found.') {
                    return done();
                }

                done(err);
            });
        });
    });

    describe('component with styles', function() {
        it('single layer', function(done) {
            test({
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
            })
            .then(done)
            .catch(done);
        });

        it('multiple layers', function(done) {
            test({
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
            })
            .then(done)
            .catch(done);
        });
    });

    describe('?styles', function() {
        it('simple', function(done) {
            test({
                path: 'only-styles/simple/',
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
            .then(done)
            .catch(done);
        });

        it('error', function(done) {
            test({
                path: 'only-styles/error/',
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
            .then(done)
            .catch(function(err) {
                if (err.message === 'Styles for component "#target?styles" were not found.') {
                    return done();
                }

                done(err);
            });
        });
    });

    describe('?class', function() {
        it('simple', function(done) {
            test({
                path: 'class/simple/',
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
            .then(done)
            .catch(done);
        });

        it('with styles', function(done) {
            test({
                path: 'class/with-styles/',
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
            .then(done)
            .catch(done);
        });
    });
});
