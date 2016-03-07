// decide if should import class instead of factory
export function shouldImportClass(result, options) {
    // importFactory is false and (we are not inside layer or importFactory in this layer is false/undefined)
    if (options.importFactory === false && (!result.layer || !result.layer.importFactory)) {
        return true;
    }

    // OR we are inside layer with importFactory false
    if (result.layer && result.layer.importFactory === false) {
        return true;
    }

    // OR there is `class` paramater in require string
    if (result.opts.class === true) {
        return true;
    }

    return false;
}
