var assert = require('assert');
var express = require('express');
var engine = require('../src/lib.js');
var request = require('request');

var PORT = 15515;
var buttonTmpl = '<button class="button button_theme_islands button_size_s button__control i-bem" data-bem=\'{"button":{}}\' role="button" type="button"><span class="icon icon_action_download"></span><span class="button__text">button</span></button>'

describe('Render templates through out express', function () {
    var app;
    var pid;
    beforeEach(function (done) {
        app = express();
        engine.init(app, {
            bemhtml: 'example/project-stub.bemhtml.js',
            priv: 'example/priv.js'
        });
        pid = app.listen(PORT, done);
    });

    afterEach(function () {
        pid.close();
    });

    describe('Success', function () {
        it('simple', function (done) {
            app.get('*', function (req, res) {
                engine.render('blocks["button"]').then(function (tmpl) {
                    assert.equal(tmpl, buttonTmpl);
                    done();
                });
            });

            request.get('http://localhost:' + PORT);
        });
    });

    describe('Failure', function () {
        it('request undefined function', function (done) {
            engine.render('undefinedFn').then(function () {
                assert(false, 'Shouldnt be successfull');
                done();
            }, function () {
                assert(true);
                done();
            });
        });
    });
});
