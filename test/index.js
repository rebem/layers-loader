import test from './helpers/';

describe('transform', function() {
    describe('simple', function() {
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

    describe('not found', function() {
        it('single layer', function(done) {
            test({
                path: 'not-found/single-layer/',
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
                if (err.message === 'Component "#target" not found.') {
                    return done();
                }

                done(err);
            });
        });

        it('single layer', function(done) {
            test({
                path: 'not-found/self/',
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
                if (err.message === 'Component "#target" not found.') {
                    return done();
                }

                done(err);
            });
        });
    });

    describe('with styles', function() {
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

    describe('only styles', function() {
        it('single layer', function(done) {
            test({
                path: 'only-styles/single-layer/',
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
                if (err.message === 'Component "#target" not found.') {
                    return done();
                }

                done(err);
            });
        });
    });
});
