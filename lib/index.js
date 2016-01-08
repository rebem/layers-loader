import falafel from 'falafel';
import loaderUtils from 'loader-utils';

import getChain from './chain';
import getOutput from './output';

export default function(source) {
    if (this.cacheable) {
        this.cacheable();
    }

    const callback = this.async();
    const options = loaderUtils.parseQuery(this.query);
    const pathsToInclude = options.layers.map(layer => layer.path).concat(options.include || []);
    const isFileInheritable = pathsToInclude.some(layerPath => {
        return this.resourcePath.indexOf(layerPath) === 0;
    });

    if (!isFileInheritable) {
        return callback(null, source);
    }

    const requiresPromises = [];
    const out = falafel(source, node => {
        if (
            node.type === 'CallExpression' &&
            node.callee.type === 'Identifier' &&
            node.callee.name === 'require' &&
            node.arguments[0].value.charAt(0) === '#'
        ) {
            const rawRequireValue = node.arguments[0].value;

            requiresPromises.push(
                getChain(rawRequireValue, this.resourcePath, options.layers).then(result => {
                    node.update(
                        getOutput(result, options)
                    );
                })
            );
        }
    });

    // no promised requires
    if (!requiresPromises.length) {
        return callback(null, source);
    }

    // wait for every promised require
    Promise.all(requiresPromises).then(() => {
        callback(null, out.toString());
    });
}
