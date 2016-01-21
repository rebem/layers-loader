export default function(result, options) {
    const styles = result.styles
        .map(stylesPath => {
            return `; require('${stylesPath}')`;
        })
        .join('');
    const createFactory = `require('react').createFactory`;

    if (result.opts.class === true) {
        return `/* ${result.raw} */ require('${result.component}')}['default']${styles}`;
    }

    return `/* ${result.raw} */ ${createFactory}(require('${result.component}')['default'])${styles}`;
}
