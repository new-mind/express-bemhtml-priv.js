var fs = require('fs');
var util = require('util');
var vm = require('vm');
var Q = require('q');

module.exports = {
    /**
     * @param {Object} app, express application
     * @param {Object} opts, required
     *   - @key {String} bemhtml, file path to bemhtml file
     *   - @key {String} priv, file path to priv.js file
     */
    init: function (app, opts) {
        var self = this;
        var sandbox = this._sandbox = vm.createContext();
        this._inited = Q.defer();

        if (!opts.bemhtml)
            throw new Error('You should point required option `bemhtml`');
        var dB = Q.defer();
        fs.readFile(opts.bemhtml, function (err, content) {
            if (err)
                throw new Error('Error during loading `bemhtml` ' + err);
            vm.runInContext(content, sandbox);
            dB.resolve();
        });

        if (!opts.priv)
            throw new Error('You should point required option `priv');
        var dP = Q.defer();
        fs.readFile(opts.priv, function (err, content) {
            if (err)
                throw new Error('Error during loading priv ' + err);
            vm.runInContext(content, sandbox);
            dP.resolve();
        });

        Q.all([dB.promise, dP.promise])
         .then(function () {
             self._inited.resolve();
        });
    },

    /**
     * @param {Function} privFn, priv.js function
     * @param {Object} [context]
     * @param {Object} [opts]
     *  - @key {Boolean} isBemjson=false, return bemjson or html
     */
    render: function (privFn, context, opts) {
        var d = Q.defer();
        var sandbox = this._sandbox;

        this._inited.promise.then(function () {
            var strArgs = context && JSON.stringify(context) || null;
            var code = util.format("var __response = %s.apply(null, %s)", privFn, strArgs); 
            var isBemjson = opts && opts.isBemjson;
            try {
                vm.runInContext(code, sandbox);

                if (!isBemjson) {
                    code = ("__response = BEMHTML.apply(__response)");
                    vm.runInContext(code, sandbox);
                }
            } catch (e) {
                d.reject(e);
            }
            d.resolve(sandbox['__response']);
        }, function (err) {
            d.reject(err);
        });

        return d.promise;
    }
}
