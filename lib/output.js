import { shouldImportClass } from './utils';

export default function(result, options) {
    const createFactory = `require('react').createFactory`;
    let styles = result.styles
        .map(stylesPath => {
            return `require('${stylesPath}')`;
        });

    if (options.cssModules) {
        styles = `require('~/css-modules-theming').compose([${styles.join(',')}])`;
    } else if (styles.length === 0) {
        styles = '';
    } else {
        styles = styles.join('; ');
    }

    if (result.opts.styles === true) {
        return `/* ${result.raw} */ ${styles}`;
    }

    const component = `require('${result.component}')['default']`;

    if (shouldImportClass(result, options)) {
        if (options.cssModules) {
            return `/* ${result.raw} */ require('~/css-modules-theming').connect(${component}, ${styles})`;
        }

        return `/* ${result.raw} */ ${component}; ${styles}`;
    }

    if (options.cssModules) {
        return `/* ${result.raw} */ ${createFactory}(require('~/css-modules-theming').connect(${component}, ${styles}))`;
    }

    return `/* ${result.raw} */ ${createFactory}(${component}); ${styles}`;
}
