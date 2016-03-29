import { BEM } from 'rebem';

import Button from '#button';

export default function(props) {
    return BEM({ block: 'dialog', mix: props.mix, mods: props.mods },
        Button({
            value: 'Confirm'
        })
    );
}
