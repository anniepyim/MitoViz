var d3 = require('d3');
var _ = require('underscore');

var reddit_url = 'http://www.reddit.com/{{subReddit}}.json';

function fetch(url, cb){
    d3.json(url, function(error, data){
        if (error) return console.warn(error);
        
        var reddits = _.map(data.data.children, function(d){
            var x = d.data;
            return {ups:x.ups, title:x.title, url:x.url};
        });
        
        cb(reddits);
    });
}

function getReddits(sub, cb){
    var subreddit = (_.isString(sub)) ? sub : '';
    
    var url = 'data/data.json';
    fetch(url, cb);
}

module.exports = getReddits;

/*

title: "Google's AlphaGo AI beats Lee Se-dol again to win Go series 4-1"
ups: 5052
url: "http://www.theverge.com/2016/3/15/11213518/alphago-deepmind-go-match-5-result"

*/