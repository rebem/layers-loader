import falafel from 'falafel';

import getChain from './chain';
import getOutput from './output';

export default function(source, file, options) {
    const pathsToInclude = options.layers.map(layer => layer.path).concat(options.include || []);
    const isFileInheritable = pathsToInclude.some(layerPath => {
        return file.indexOf(layerPath) === 0;
    });

    if (!isFileInheritable) {
        return Promise.resolve(source);
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
                getChain(rawRequireValue, file, options.layers).then(result => {
                    node.update(
                        getOutput(result, options)
                    );
                })
            );
        }
    });

    // no promised requires
    if (!requiresPromises.length) {
        return Promise.resolve(source);
    }

    // wait for every promised require
    return Promise.all(requiresPromises).then(() => {
        return out.toString();
    });
}
