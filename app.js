const axios = require('axios');
const jsdom = require('jsdom');
const mongoose = require('mongoose');


// MongoDB link goes here:
let mongoDB = 'mongodb://username:password@host:port/db';
let keyword = process.argv[2];
let maxPages = 10;

mongoose.connect(mongoDB, {
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let Thread = require('./models/thread');

const {
    JSDOM
} = jsdom;

for (let pageNum = 1; pageNum <= maxPages; pageNum++) {

    axios.get('http://www.fixya.com/search.aspx?ref=ser&s=' + encodeURI(keyword) + '&/page-' + pageNum)
        .then((response) => {
            const domSearch = new JSDOM(response.data);
            let items = domSearch.window.document.querySelectorAll('[itemprop="itemListElement"]');
            items.forEach((e) => {
                let link = e.querySelectorAll('a')[0].getAttribute('href');
                axios.get(link)
                    .then((response) => {
                        const domPost = new JSDOM(response.data);
                        let viewsCount = domPost.window.document.querySelector('.meter').querySelector('p').textContent
                            .replace(/people viewed this question/g, '')
                            .replace(/\s/g, '')
                            .replace(/,/g, '');
                        let answersCount = domPost.window.document.querySelector('[itemprop="answerCount"]').textContent;
                        var newThread = new Thread({
                            'url': link,
                            viewsCount,
                            answersCount
                        });
                        newThread.save((e) => {
                            // console.log(e);
                        });
                    })
                    .catch((e) => {
                        console.log(link, e);
                    });
            })
        })
        .catch((error) => {
            console.log(error);
        });
}