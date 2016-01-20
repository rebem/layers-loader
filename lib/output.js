export default function(result, options) {
    const styles = result.styles.map(stylesPath => {
        return `require('${stylesPath}')`;
    }).join('; ');
    const createFactory = `require('react').createFactory`;
    const requireEs6 = (path) => `function(obj){ return obj && obj.__esModule ? obj : { \'default\': obj }; }(require('${path}')).default`;

    if (result.opts.class === true) {
        return `/* ${result.raw} */ require('${result.component}'); ${styles}`;
    }

    return `/* ${result.raw} */ ${createFactory}(${requireEs6(result.component)}); ${styles}`;
}
