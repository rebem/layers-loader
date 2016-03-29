import { Component } from 'react';
import { BEM } from 'rebem';

import DeleteButton from '#button/_type/delete';
import Dialog from '#dialog';

class Demo extends Component {
    static displayName = 'Demo';

    render() {
        return BEM({ block: 'demo' },
            DeleteButton({
                value: 'Delete me!'
            }),
            Dialog()
        );
    }
}
