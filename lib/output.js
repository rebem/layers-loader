export default function(result, options) {
    const styles = result.styles.map(stylesPath => {
        return `require('${stylesPath}')`;
    }).join('; ');
    const createFactory = `require('react').createFactory`;

    function requireES6(path) {
        return `require('babel-runtime/helpers/interop-require-default')['default'](require('${path}'))['default']`;
    }

    if (result.opts.class === true) {
        return `/* ${result.raw} */ ${requireES6(result.component)}; ${styles}`;
    }

    return `/* ${result.raw} */ ${createFactory}(${requireES6(result.component)}); ${styles}`;
}
