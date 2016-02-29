// decide if should export class instead of factory
export function shouldExportClass(result, options, layerConfig) {
    // exportFactory is false and (we are not inside layer or exportFactory in this layer is false/undefined)
    if (options.exportFactory === false && (!layerConfig || !layerConfig.exportFactory)) {
        return true;
    }

    // OR we are inside layer with exportFactory false
    if (layerConfig && layerConfig.exportFactory === false) {
        return true;
    }

    // OR there is `class` paramater in require string
    if (result.opts.class === true) {
        return true;
    }

    return false;
}
