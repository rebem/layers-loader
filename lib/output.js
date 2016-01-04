export default function(result) {
    const stylesString = result.styles.map(stylesPath => {
        return `require('${stylesPath}')`;
    }).join(';');

    if (result.opts.class === true) {
        return `/* ${result.raw} */ require('${result.component}');${stylesString}`;
    }

    return `/* ${result.raw} */ require('@yummies/yummies').createFactory(require('${result.component}'));${stylesString}`;
}
