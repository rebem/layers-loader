import fs from 'fs';
import path from 'path';
import pathExists from 'path-exists';
import yaml from 'js-yaml';

const cache = {};

function readConfig(configDir) {
    if (configDir in cache) {
        return Promise.resolve(cache[configDir]);
    }

    const configPath = path.resolve(configDir, '.yummies.yml');

    return pathExists(configPath).then(exists => {
        if (exists) {
            return new Promise((resolve, reject) => {
                fs.readFile(configPath, 'utf-8', (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    cache[configDir] = yaml.safeLoad(data);

                    resolve(cache[configDir]);
                });
            });
        }

        return {};
    });
}

export default function(options) {
    return Promise.all(
        options.layers.map(layer => {
            const layerMode = layer.mode || 'default';

            return readConfig(layer.path).then(configData => {
                const layerConfig = configData[layerMode];
                const layerComponentsPath = path.resolve(layer.path, layerConfig.path);

                const config = {
                    path: layer.path,
                    components: layerComponentsPath
                };

                if ('main' in layerConfig.files) {
                    config.main = layerConfig.files.main;
                }

                if ('styles' in layerConfig.files) {
                    config.styles = layerConfig.files.styles;
                }

                return config;
            });
        })
    );
}
