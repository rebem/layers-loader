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

function getPossibleMainPaths(currentFilePath, component, layers) {
    return layers
        .filter(layer => ('main' in layer))
        .map(layer => path.join(layer.components, component, layer.main))
        .filter(possiblePath => possiblePath !== currentFilePath);
}

function getPossibleStylesPaths(component, layers) {
    return layers
        .filter(layer => ('styles' in layer))
        .map(layer => path.join(layer.components, component, layer.styles));
}

function filterPaths(paths) {
    const pathsPromises = paths.map(item => {
        return pathExists(item).then(exists => {
            if (exists) {
                return item;
            }
        });
    });

    return Promise.all(pathsPromises).then(result => {
        return result.filter(item => item);
    });
}

function filterMainPath(paths) {
    return filterPaths(paths).then(result => result[result.length - 1]);
}

function filterStylesPaths(paths) {
    return filterPaths(paths);
}

export default function(requiredString, currentFilePath, layers) {
    const required = parseRequiredString(requiredString);

    if (requiredString in cache) {
        return Promise.resolve(cache[requiredString]);
    }

    const remainingLayers = getRemainingLayers(currentFilePath, layers);
    const possibleMainPaths = getPossibleMainPaths(currentFilePath, required.component, remainingLayers);
    const possibleStylesPaths = getPossibleStylesPaths(required.component, remainingLayers);
    const mainPathPromise = filterMainPath(possibleMainPaths);
    const stylesPathsPromise = filterStylesPaths(possibleStylesPaths);

    return Promise
        .all([ mainPathPromise, stylesPathsPromise ])
        .then(([ mainPath, stylesPaths ]) => {
            cache[requiredString] = {
                raw: requiredString,
                opts: required.opts,
                component: mainPath,
                styles: stylesPaths
            };

            return cache[requiredString];
        });
}
