var express = require('express');
var app = express();

var shortener = {};
app.get('/:id', function(req, res, next) {
    var id = req.params.id;
    if (shortener[id]) {
        res.redirect(shortener[id]);    
    } else {
        res.json({"error":"No short url found for given input"});
    }
});
app.get('*', function(req, res, next) {
    var url = req.originalUrl;
    if (new RegExp("\/new\/(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]").test(url)) {
        url = url.replace(/\/new\//, '');
        var id;
        var size = 0;
        for (var key in shortener) {
            if (shortener[key] == url) {
                id = key;
            }
            size++;
        }
        if (id==null) {
            id = size + 1;
            shortener[id] = url;
        }
        res.json({
            "original_url":url,
            "short_url": req.protocol + '://' + req.get('host')+'/'+id
        });
    } else {
        res.json({
            "error":"URL invalid"
        });
    }
});

app.listen(process.env.PORT || 8080, function(){
   console.log('Running.'); 
});