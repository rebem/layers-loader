export default function(result, options) {
    const styles = result.styles.map(stylesPath => {
        return `require('${stylesPath}')`;
    }).join('; ');
    const yummify = `require('@yummies/yummies').yummify`;
    const createFactory = `require('@yummies/yummies').createFactory`;
    const inject = `module.__yummies__ = module.__yummies__ || {}; module.__yummies__['${result.component}'] = '${result.raw}'`;

    if (options.injectable) {
        if (result.opts.inject === true) {
            if (result.opts.class === true) {
                return `/* ${result.raw} */ function(injects) { return ${yummify}(require('@yummies/layers-loader/build/inject!${result.component}')(injects)); }; ${styles}`;
            }

            return `/* ${result.raw} */ function(injects) { return ${createFactory}(require('@yummies/layers-loader/build/inject!${result.component}')(injects)); }; ${styles}`;
        }

        if (result.opts.class === true) {
            return `/* ${result.raw} */ (function() {
                ${inject};

                var out = ${yummify}(
                    require('${result.component}')
                );

                ${styles};

                return out;
            })()`;
        }

        return `/* ${result.raw} */ (function() {
            ${inject};

            var out = ${createFactory}(
                require('${result.component}')
            );

            ${styles};

            return out;
        })()`;
    }

    if (result.opts.class === true) {
        return `/* ${result.raw} */ ${yummify}(require('${result.component}')); ${styles}`;
    }

    return `/* ${result.raw} */ ${createFactory}(require('${result.component}')); ${styles}`;
}
