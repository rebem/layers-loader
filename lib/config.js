export default function(options) {
    return options.layers.map(layer => {
        const layerMode = layer.mode || 'default';

        return layer.module[layerMode];
    });
}
