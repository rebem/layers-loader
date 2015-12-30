export function getOutput(result) {
    const stylesString = result.styles.map(stylesPath => {
        return `require('${stylesPath}')`;
    }).join(';');

    return `/* ${result.raw} */ require('@yummies/yummies').createFactory(require('${result.component}'));${stylesString}`;
}
