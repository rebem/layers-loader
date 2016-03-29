import loaderUtils from 'loader-utils';

import transform from './transform';

export default function(source) {
    if (this.cacheable) {
        this.cacheable();
    }

    const callback = this.async();
    const options = loaderUtils.parseQuery(this.query);

    transform.call(this, source, this.resourcePath, options)
        .then(result => {
            callback(null, result);
        })
        .catch(err => {
            callback(err);
        });
}
