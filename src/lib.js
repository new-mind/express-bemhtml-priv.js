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
    init: function (app, opts, callback) {
        var sandbox = vm.createContext();

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
            /**
             * @param {Function} privFn, priv.js function
             * @param {Object} [context]
             * @param {Object} [opts]
             *  - @key {Boolean} isBemjson=false, return bemjson or html
             */
            app.engine('bemhtml-priv.js', function (privFn, context, opts) {
                var strArgs = context && JSON.stringify(context) || null;
                var code = util.format("var __response = %s.apply(null, %s)", privFn, strArgs); 
                var isBemjson = opts && opts.isBemjson;
                vm.runInContext(code, sandbox);

                if (!isBemjson) {
                    code = ("__response = BEMHTML.apply(__response)");
                    vm.runInContext(code, sandbox);
                }
                return sandbox['__response'];
            });
            callback(null);
        });
    }
}
