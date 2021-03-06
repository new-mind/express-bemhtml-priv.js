var engine = require('../src/lib');
var assert = require('assert');
var path = require('path');

var mock = {
    use: function (key, name) {},
    set: function () {}
}
var buttonTmpl = '<button class="button button_theme_islands button_size_s button__control i-bem" data-bem=\'{"button":{}}\' role="button" type="button"><span class="icon icon_action_download"></span><span class="button__text">button</span></button>'

describe('Common test suites', function () {
    beforeEach(function () {
        engine.init(mock, {
            bemhtml: path.resolve(__dirname, '../example/project-stub.bemhtml.js'),
            priv: path.resolve(__dirname, '../example/priv.js')
        });
    });

    it('Should be successfull', function (done) {

        engine.render('blocks["button"]').then(function (tmpl) {
            assert.equal(tmpl, buttonTmpl);
            done();
        });
    })
});
