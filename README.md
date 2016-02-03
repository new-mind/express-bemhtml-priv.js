## Express-bemhtml-priv.js

Simple render engine for express with bemhtml and priv.js technologies    


```javascript
var engine = require('express-bemhtml-priv.js');
engine.init(app, {
    bemhtml: 'path/to/bemhtml/file',
    priv: 'path/to/priv.js/file'
});

...
engine.render('blocks["market"]', {..})
    .then(function (tmpl) {
        res.send(tmpl);
    });;
```
