const async = require('async');
const phantom = require('phantom');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const config = require(__dirname + '/config.js');

const app = express();


//For serving the index.html and all the other front-end assets.
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cors());

//Add new user
app.route('/api/v1/takeshot/:url/:file').get(takeShot);




//If we reach this middleware the route could not be handled and must be unknown.
app.use(handle404);

//Generic error handling middleware.
app.use(handleError);



function takeShot(req, res)
{
 let url = req.params.url,
     ext = req.params.file;

 (async function() {
    const instance = await phantom.create();
    const page = await instance.createPage();

    await page.property('viewportSize', {width: 1024, height: 600});
    const status = await page.open(url);

    let f = Date.now();
    await page.render(f + '.' + ext);

    let json = {status: status, url: url, file: f + '.' + ext, credit: 'Powered by SaaS'};
    res.send(json);

    await instance.exit();
}());

}



//Page-not-found middleware
function handle404(req, res, next) {
  res.status(404).end('not found');
}

/*
* Generic error handling middleware.
* Send back a 500 page and log the error to the console.
*/
function handleError(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({err: err.message});
}

//Start listening to port
function startExpress() {
  app.listen(config.express.port);
  console.log('Listening on port ' + config.express.port);
}

startExpress();
