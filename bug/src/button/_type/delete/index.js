import Button from '#button';

export default function buttonTypeDelete(props) {
    return Button({
        ...props,
        mods: {
            type: 'delete',
            ...props.mods
        }
    });
}
