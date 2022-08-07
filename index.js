const express = require('express');
const app = express();
var cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

app.use(
    cors({
        credentials: true,
        origin: true
    })
);
app.options('*', cors());

app.get('/search', async (req, res) => {

    search = encodeURI(req.query.q);
    var response = await axios.get(`https://pt.wikipedia.org/w/api.php?action=opensearch&search=${search}&limit=20`);
    results = response.data;
    var options = [];
    if (typeof results[1] != 'string') {
        options = results[1].map(function (value, index) {
            return { name: value, link: results[3][index] }
        });
    }
    res.send(options);
});


app.get('/random', async (req, res) => {
    var response = await axios.get('https://pt.wikipedia.org/wiki/Especial:Aleat%C3%B3ria');
    var $ = cheerio.load(response.data);
    var title = $('#firstHeading').text();
    var link = $('#ca-nstab-main').find('a').attr('href');
    var resume = $($('#mw-content-text').find('p')[0]).text()

    res.send({ title: title, link: link, resume: resume });
})

app.get('/related', async (req, res) => {
    var url = req.query.url.replace('https://pt.wikipedia.org/wiki/', '');
    url = url.replace('/wiki/', '');

    console.log(encodeURI(url));
    try {
        var response = await axios.get('https://pt.wikipedia.org/wiki/' + encodeURI(url));
        var $ = cheerio.load(response.data);
        var Links = $('#content').find('a').toArray().map(element => {
            var href = $(element).attr('href');
            if (!$(element).hasClass('external') && href && href.indexOf('/wiki') == 0) {
                var title = $(element).text();
                console.log(title);
                if (title) {
                    return { title: title, link: href };
                }
            }
        })

        Links = Links.filter(element => {
            if (element) {
                return element;
            }
        });
        res.send(Links);

    } catch (error) {
        res.send(error);
    }

})

app.listen(process.env.PORT || 3000, function () {
    console.log('server running on port 3000', '');
});

async function getRelated(url) {

}