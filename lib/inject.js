import falafel from 'falafel';

export default function(source) {
    if (this.cacheable) {
        this.cacheable();
    }

    const result = falafel(source, node => {
        if (
            node.type === 'CallExpression' &&
            node.callee.type === 'Identifier' &&
            node.callee.name === 'require'
        ) {
            const value = node.arguments[0].value;

            node.update(`typeof __inject__('${value}') !== 'undefined' ? __inject__('${value}') : require('${value}')`);
        }
    });

    return `
module.exports = function(__injections__) {
    var module = { exports: {} };
    var exports = module.exports;

    function __inject__(value) {
        return __injections__[module.__yummies__ ? module.__yummies__[value] : value];
    }

    ${result.toString()}

    return module.exports;
};
    `;
}
