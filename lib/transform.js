import falafel from 'falafel';

import getResults from './runner';
import getOutput from './output';
import getOutputWithInjects from './inject/output';

export default function(source, file, options) {
    const pathsToInclude = options.layers.map(layer => layer.path).concat(options.include || []);
    const isFileInheritable = pathsToInclude.some(layerPath => {
        return file.indexOf(layerPath) === 0;
    });

    if (!isFileInheritable) {
        return Promise.resolve(source);
    }

    // if current file is inside the layer, find its config
    const layerConfig = options.layers.filter(layer => {
        return file.indexOf(layer.path) === 0;
    })[0];

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
                getResults(rawRequireValue, file, options.layers).then(result => {
                    if (options.injectable) {
                        node.update(getOutputWithInjects(result, options, layerConfig));
                    } else {
                        node.update(getOutput(result, options, layerConfig));
                    }
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
