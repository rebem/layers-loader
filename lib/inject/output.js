export default function(result, options) {
    const styles = result.styles.map(stylesPath => {
        return `require('${stylesPath}')`;
    }).join('; ');
    const createFactory = `require('react').createFactory`;
    const inject = `module.__rebem__ = module.__rebem__ || {}; module.__rebem__['${result.component}'] = '${result.raw}'`;

    if (result.opts.inject === true) {
        if (options.exportFactory === false || result.opts.class === true) {
            return `/* ${result.raw} */ function(injects) { return require('rebem-layers-loader/build/inject/loader!${result.component}')['default'](injects); }; ${styles}`;
        }

        return `/* ${result.raw} */ function(injects) { return ${createFactory}(require('rebem-layers-loader/build/inject/loader!${result.component}')['default'](injects)); }; ${styles}`;
    }

    if (options.exportFactory === false || result.opts.class === true) {
        return `/* ${result.raw} */ (function() {
            ${inject};

            var out = require('${result.component}')['default'];

            ${styles};

            return out;
        })()`;
    }

    return `/* ${result.raw} */ (function() {
        ${inject};

        var out = ${createFactory}(require('${result.component}')['default']);

        ${styles};

        return out;
    })()`;
}
