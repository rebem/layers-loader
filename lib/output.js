import { shouldImportClass } from './utils';

export default function(result, options) {
    const createFactory = `require('react').createFactory`;
    let styles = result.styles
        .map(stylesPath => {
            return `require('${stylesPath}')`;
        })
        .join('; ');

    if (result.opts.styles === true) {
        return `/* ${result.raw} */ ${styles}`;
    }

    styles = styles ? '; ' + styles : styles;

    if (shouldImportClass(result, options)) {
        return `/* ${result.raw} */ require('${result.component}')['default']${styles}`;
    }

    return `/* ${result.raw} */ ${createFactory}(require('${result.component}')['default'])${styles}`;
}
