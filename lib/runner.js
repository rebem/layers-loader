import path from 'path';
import pathExists from 'path-exists';
import loaderUtils from 'loader-utils';
import 'core-js/fn/array/find';
import 'core-js/fn/string/starts-with';

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
    const layersCache = loaderUtils.getHashDigest(layers.toString());
    const currentLayerIndex = getCurrentLayerIndex(currentPath, layers);
    const currentLayer = layers[currentLayerIndex];
    const requiredFile = path.join(required.component, currentLayer.files.main);
    const result = layersCache + '-' + currentLayerIndex +
        '#' + required.component + JSON.stringify(required.opts);

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

function getCurrentLayerConfig(currentPath, layers) {
    return layers.find(layer => currentPath.startsWith(layer.path));
}

function getRemainingLayers(currentPath, component, layers) {
    const currentLayerIndex = getCurrentLayerIndex(currentPath, layers);
    const currentLayer = layers[currentLayerIndex];
    const requiredFile = path.join(component, currentLayer.files.main);

    if (currentPath.length - currentPath.lastIndexOf(requiredFile) === requiredFile.length) {
        return layers.slice(0, currentLayerIndex + 1);
    }

    return layers;
}

function getPossibleMainPaths(currentPath, component, layers) {
    const remainingLayers = getRemainingLayers(currentPath, component, layers);

    return remainingLayers
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
    const currentLayerConfig = getCurrentLayerConfig(currentPath, layers);
    const required = parseRequiredString(requiredString);
    const cacheKey = generateCacheKey(required, currentPath, layers);

    if (cacheKey in cache) {
        return cache[cacheKey];
    }

    if (required.opts.styles === true) {
        const possibleStylesPaths = getPossibleStylesPaths(required.component, layers);
        const stylesPathsPromise = filterStylesPaths(possibleStylesPaths);

        cache[cacheKey] = stylesPathsPromise.then(stylesPaths => {
            if (stylesPaths.length === 0) {
                throw new Error(`Styles for component "${requiredString}" were not found.`);
            }

            return {
                raw: requiredString,
                opts: required.opts,
                layer: currentLayerConfig,
                component: null,
                styles: stylesPaths
            };
        });

        return cache[cacheKey];
    }

    const possibleMainPaths = getPossibleMainPaths(currentPath, required.component, layers);
    const possibleStylesPaths = getPossibleStylesPaths(required.component, layers);
    const mainPathPromise = filterMainPath(possibleMainPaths);
    const stylesPathsPromise = filterStylesPaths(possibleStylesPaths);

    cache[cacheKey] = Promise
        .all([ mainPathPromise, stylesPathsPromise ])
        .then(([ mainPath, stylesPaths ]) => {
            if (!mainPath) {
                throw new Error(`Component "${requiredString}" was not found.`);
            }

            return {
                raw: requiredString,
                opts: required.opts,
                layer: currentLayerConfig,
                component: mainPath,
                styles: stylesPaths
            };
        });

    return cache[cacheKey];
}
