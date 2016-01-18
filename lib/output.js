export default function(result, options) {
    const styles = result.styles.map(stylesPath => {
        return `require('${stylesPath}')`;
    }).join('; ');
    const createFactory = `require('react').createFactory`;
    const inject = `module.__rebem__ = module.__rebem__ || {}; module.__rebem__['${result.component}'] = '${result.raw}'`;
    const requireEs6 = (path) => `function(obj){ return obj && obj.__esModule ? obj : { \'default\': obj }; }(require('${path}')).default`;

    if (options.injectable) {
        if (result.opts.inject === true) {
            if (result.opts.class === true) {
                return `/* ${result.raw} */ function(injects) { return require('rebem-layers-loader/build/inject!${result.component}')(injects); }; ${styles}`;
            }

            return `/* ${result.raw} */ function(injects) { return ${createFactory}(${requireEs6(`rebem-layers-loader/build/inject!${result.component}`)}(injects)); }; ${styles}`;
        }

        if (result.opts.class === true) {
            return `/* ${result.raw} */ (function() {
                ${inject};

                var out = require('${result.component}');

                ${styles};

                return out;
            })()`;
        }

        return `/* ${result.raw} */ (function() {
            ${inject};

            var out = ${createFactory}(${requireEs6(result.component)});

            ${styles};

            return out;
        })()`;
    }

    if (result.opts.class === true) {
        return `/* ${result.raw} */ require('${result.component}'); ${styles}`;
    }

    return `/* ${result.raw} */ ${createFactory}(${requireEs6(result.component)}); ${styles}`;
}
