var blocks = {};
blocks['button'] = function (data, env) {
    // needfull for support console
    console
    return {
        block : 'button',
        mods : { theme : 'islands', size : 's' },
        text : 'button',
        icon : { block : 'icon', mods : { action : 'download' } }
    }
}
