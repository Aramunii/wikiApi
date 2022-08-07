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
    var response = await axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${search}&limit=20`);
    results = response.data;
    var options = results[1].map(function (value, index) {
        return { name: value, link: results[3][index] }
    });
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

app.listen(process.env.PORT || 3000, function () {
    console.log('server running on port 3000', '');
});


async function getRelated(url) {
    var response = await axios.get('https://pt.wikipedia.org/wiki/J%C3%B4_Soares');
    var $ = cheerio.load(response.data);
    var Links = $('#content').find('a').toArray().map(element => {
        var href = $(element).attr('href');
        if (!$(element).hasClass('external') && href && href.indexOf('/wiki') == 0) {
            var title = $(element).text();
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

    return Links;
}