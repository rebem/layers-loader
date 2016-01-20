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

function generateCacheKey(required, currentPath, layers) {
    const currentLayerIndex = getCurrentLayerIndex(currentPath, layers);
    const currentLayer = layers[currentLayerIndex];
    const requiredFile = path.join(required.component, currentLayer.files.main);
    const result = currentLayerIndex + '#' + required.component + JSON.stringify(required.opts);

    if (currentPath.length - currentPath.lastIndexOf(requiredFile) === requiredFile.length) {
        return result + currentPath;
    }

    return result;
}

function getCurrentLayerIndex(currentPath, layers) {
    return layers.reduce((result, layer, index) => {
        if (currentPath.indexOf(layer.path) === 0) {
            return index;
        }

        return result;
    }, layers.length - 1);
}

function getRemainingLayers(currentPath, layers) {
    const currentLayerIndex = getCurrentLayerIndex(currentPath, layers);

    return layers.slice(0, currentLayerIndex + 1);
}

function getPossibleMainPaths(currentPath, component, layers) {
    return layers
        .filter(layer => ('main' in layer.files))
        .map(layer => path.join(layer.path, component, layer.files.main))
        .filter(possiblePath => possiblePath !== currentPath);
}

function getPossibleStylesPaths(component, layers) {
    return layers
        .filter(layer => ('styles' in layer.files))
        .map(layer => path.join(layer.path, component, layer.files.styles));
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

export default function(requiredString, currentPath, layers) {
    const required = parseRequiredString(requiredString);
    const cacheKey = generateCacheKey(required, currentPath, layers);

    if (cacheKey in cache) {
        return cache[cacheKey];
    }

    const remainingLayers = getRemainingLayers(currentPath, layers);
    const possibleMainPaths = getPossibleMainPaths(currentPath, required.component, remainingLayers);
    const possibleStylesPaths = getPossibleStylesPaths(required.component, layers);
    const mainPathPromise = filterMainPath(possibleMainPaths);
    const stylesPathsPromise = filterStylesPaths(possibleStylesPaths);

    cache[cacheKey] = Promise
        .all([ mainPathPromise, stylesPathsPromise ])
        .then(([ mainPath, stylesPaths ]) => {
            if (!mainPath) {
                throw new Error(`Component "${requiredString}" not found.`);
            }

            cache[cacheKey] = {
                raw: requiredString,
                opts: required.opts,
                component: mainPath,
                styles: stylesPaths
            };

            return cache[cacheKey];
        });

    return cache[cacheKey];
}
