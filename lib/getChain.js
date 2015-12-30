import path from 'path';
import pathExists from 'path-exists';
import loaderUtils from 'loader-utils';

const cache = {};

function parseRequiredString(requiredString) {
    const matched = requiredString.match(/^#(.+?)(\?.+)?$/);
    const component = matched[1];
    const opts = loaderUtils.parseQuery(matched[2]);

    return {
        component,
        opts
    };
}

function getCurrentLayerIndex(currentFilePath, layers) {
    return layers.reduce((result, layer, index) => {
        if (currentFilePath.indexOf(layer.path) === 0) {
            return index;
        }

        return result;
    }, layers.length - 1);
}

function getRemainingLayers(currentFilePath, layers) {
    const currentLayerIndex = getCurrentLayerIndex(currentFilePath, layers);

    return layers.slice(0, currentLayerIndex + 1);
}

function getPossibleMainPaths(component, layers) {
    return layers
        .filter(layer => ('main' in layer))
        .map(layer => path.join(layer.components, component, layer.main));
}

function getPossibleStylesPaths(component, layers) {
    return layers
        .filter(layer => ('styles' in layer))
        .map(layer => path.join(layer.components, component, layer.styles));
}

function filterMainPath(paths) {
    const result = [];

    const promise = paths.reduce((sequence, item) => {
        return sequence.then(() => {
            return pathExists(item);
        }).then(exists => {
            if (exists) {
                result.push(item);
            }
        });
    }, Promise.resolve());

    return promise.then(() => result[result.length - 1]);
}

function filterStylesPaths(paths) {
    const result = [];

    const promise = paths.reduce((sequence, item) => {
        return sequence.then(() => {
            return pathExists(item);
        }).then(exists => {
            if (exists) {
                result.push(item);
            }
        });
    }, Promise.resolve());

    return promise.then(() => result);
}

export default function(requiredString, currentFilePath, layers) {
    const required = parseRequiredString(requiredString);

    if (requiredString in cache) {
        return Promise.resolve(cache[requiredString]);
    }

    const remainingLayers = getRemainingLayers(currentFilePath, layers);
    const possibleMainPaths = getPossibleMainPaths(required.component, remainingLayers);
    const possibleStylesPaths = getPossibleStylesPaths(required.component, remainingLayers);
    const mainPathPromise = filterMainPath(possibleMainPaths);
    const stylesPathsPromise = filterStylesPaths(possibleStylesPaths);

    return Promise
        .all([ mainPathPromise, stylesPathsPromise ])
        .then(([ mainPath, stylesPaths ]) => {
            cache[requiredString] = {
                raw: requiredString,
                component: mainPath,
                styles: stylesPaths
            };

            return cache[requiredString];
        });
}
