## Express-bemhtml-priv.js

Simple render engine for express with bemhtml and priv.js technologies    


```javascript
var engine = require('express-bemhtml-priv.js');
engine.init(app, {
    bemhtml: 'path/to/bemhtml/file',
    priv: 'path/to/priv.js/file'
});

...
engine.render('blocks["market"]', [args, ])
    .then(function (tmpl) {
        res.send(tmpl);
    });;
```

### API

```javascript

/**
 * Initialization funciton to bind engine to application and point pathes to templates
 *
 * @param {Object} app, express instance
 * @param {Object} opts
 *  @key {String} bemhtml - path to bemhtml template file
 *  @key {String} priv - path to priv template file
 *
 * All options are required
 */
function init(app, opts)
```


```javascript

/**
 * Render function that returns promise
 *
 * @param {Function} privFn, function in global scope for priv.js
 * @param {Array} args, array of arguments for privFn, executed as privFn.apply(args);
 *
 */
function render(privFn, args);
```
