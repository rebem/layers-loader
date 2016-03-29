import fs from 'fs';
import path from 'path';
import pify from 'pify';

const readFile = pify(fs.readFile);

export default function(params) {
    delete require.cache[require.resolve('../../lib/transform')];
    delete require.cache[require.resolve('../../lib/runner')];

    const transform = require('../../lib/transform');
    const testPath = path.resolve('./test/fixtures/', params.path);
    const loaderContext = {
        context: testPath
    };
    const componentPath = path.resolve(testPath, params.test);
    const resultPath = path.resolve(testPath, 'result.js');
    const options = {
        ...params.options,
        layers: params.options.layers.map(layer => {
            return {
                ...layer,
                path: path.resolve(testPath, layer.path)
            };
        })
    };

    return readFile(componentPath, 'utf-8').then(sourceData => {
        return readFile(resultPath, 'utf-8').then(resultData => {
            return transform.call(loaderContext, sourceData, componentPath, options).then(result => {
                if (result !== resultData) {
                    console.log('actual:', result);
                    console.log('expected:', resultData);

                    throw new Error('oops');
                }
            });
        });
    });
}
