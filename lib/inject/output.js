import { shouldExportClass } from '../utils';

export default function(result, options) {
    const createFactory = `require('react').createFactory`;
    let styles = result.styles
        .map(stylesPath => {
            return `require('${stylesPath}')`;
        })
        .join('; ');
    const inject = `module.__rebem__ = module.__rebem__ || {}; module.__rebem__['${result.component}'] = '${result.raw}'`;

    if (result.opts.styles === true) {
        return `/* ${result.raw} */ ${styles}`;
    }

    styles = styles ? '; ' + styles : styles;

    if (result.opts.inject === true) {
        if (shouldExportClass(result, options)) {
            return `/* ${result.raw} */ function(injects) { return require('rebem-layers-loader/build/inject/loader!${result.component}')['default'](injects); }${styles}`;
        }

        return `/* ${result.raw} */ function(injects) { return ${createFactory}(require('rebem-layers-loader/build/inject/loader!${result.component}')['default'](injects)); }${styles}`;
    }

    if (shouldExportClass(result, options)) {
        return `/* ${result.raw} */ (function() { ${inject}; var out = require('${result.component}')['default']${styles};  return out; })()`;
    }

    return `/* ${result.raw} */ (function() { ${inject}; var out = ${createFactory}(require('${result.component}')['default'])${styles}; return out; })()`;
}
