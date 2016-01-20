import fs from 'fs';
import path from 'path';

import transform from '../../lib/transform';

export default function(params) {
    return new Promise((resolve, reject) => {
        const testPath = path.resolve('./test/fixtures/', params.path);
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

        fs.readFile(componentPath, 'utf-8', function(sourceErr, sourceData) {
            if (sourceErr) {
                return reject(sourceErr);
            }

            fs.readFile(resultPath, 'utf-8', function(resultErr, resultData) {
                if (resultErr) {
                    return reject(resultErr);
                }

                transform(sourceData, componentPath, options)
                    .then(result => {
                        result = result.split(testPath + '/').join('');

                        if (result === resultData) {
                            resolve();
                        } else {
                            console.log('actual:', result);
                            console.log('expected:', resultData);
                            reject('oops');
                        }

                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        });
    });
}
