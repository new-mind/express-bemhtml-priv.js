var blocks = {};
blocks['button'] = function (data, env) {
    return {
        block : 'button',
        mods : { theme : 'islands', size : 's' },
        text : 'button',
        icon : { block : 'icon', mods : { action : 'download' } }
    }
}
