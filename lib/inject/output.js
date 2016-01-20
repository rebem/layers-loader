export default function(result, options) {
    const styles = result.styles.map(stylesPath => {
        return `require('${stylesPath}')`;
    }).join('; ');
    const createFactory = `require('react').createFactory`;
    const inject = `module.__rebem__ = module.__rebem__ || {}; module.__rebem__['${result.component}'] = '${result.raw}'`;

    function requireES6(path) {
        return `require('babel-runtime/helpers/interop-require-default')['default'](require('${path}'))['default']`;
    }

    if (result.opts.inject === true) {
        if (result.opts.class === true) {
            return `/* ${result.raw} */ function(injects) { return ${requireES6(`'rebem-layers-loader/build/inject/loader!${result.component}'`)}(injects); }; ${styles}`;
        }

        return `/* ${result.raw} */ function(injects) { return ${createFactory}(${requireES6(`'rebem-layers-loader/build/inject/loader!${result.component}'`)}(injects)); }; ${styles}`;
    }

    if (result.opts.class === true) {
        return `/* ${result.raw} */ (function() {
            ${inject};

            var out = ${requireES6(result.component)};

            ${styles};

            return out;
        })()`;
    }

    return `/* ${result.raw} */ (function() {
        ${inject};

        var out = ${createFactory}(${requireES6(result.component)});

        ${styles};

        return out;
    })()`;
}
