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

app.get('/', async (req, res) => {
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

    Links = Links.filter(element=>{
        if(element)
        {
            return element;
        }
    });

    res.send(Links)
});

app.listen(process.env.PORT || 3000, function () {
    console.log('server running on port 3000', '');
});