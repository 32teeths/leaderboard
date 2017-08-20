/*
Brew is an attempt to build a bot using the Slack api
Have used Firebase to store the content 
*/

var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var firebase = require("firebase");
var moment = require('moment');
var count;

// Initialize Firebase
console.log(process.env.firebaseConfig);
firebase.initializeApp(JSON.parse(process.env.firebaseConfig));

// Endpoint to enable OAuth access for the app
// app.get('/OAuth', (req, res) => {
//     var options = {
//         uri: 'https://slack.com/api/oawuth.access?code='
//         + req.query.code +
//         '&client_id=' + process.env.clientId +
//         '&client_secret=' + process.env.clientSecret +
//         '&redirect_uri=' + 'https://slackbrew.herokuapp.com/OAuth' +
//         '&scope=incoming-webhook,commands,bot,chat.update',
//         method: 'GET'
//     }
//     // Redirect the request to url ,with the required params
//     // request(options, (error, response, body) => {
//     //     var JSONresponse = JSON.parse(body)
//     //     if (!JSONresponse.ok) {
//     //         res.send("Error encountered: \n" + JSON.stringify(JSONresponse)).status(200).end()
//     //     } else {
//     //         // Its better to store the token in firebase for later use
//     //         firebase.database().ref('app/config').set(response);
//     //         res.send("Success!")
//     //     }
//     // })
// });

app.get('/check', (req, res) => {

    // var reqBody = JSON.parse(req.body.payload);

    // var base_url = 'month/' + moment().format('YYYY-MM') + '/day/' + moment().format('YYYY-MM-DD');

    // var newEntry = firebase.database().ref(base_url + '/commits').push();

    // newEntry.set({ time: moment().format(), commit: reqBody });

    // res.status(200).end() // respond with 200

    res.send('Success');
});


app.post('/commits', urlencodedParser, (req, res) => {

    // console.log(req.body);

    // var reqBody = JSON.parse(req.body.payload);

    // var base_url = 'month/' + moment().format('YYYY-MM') + '/day/' + moment().format('YYYY-MM-DD');

    var newEntry = firebase.database().ref('/commits').push();

    console.log(req);

    console.log("=======");

    console.log(req.body);

    newEntry.set({ time: moment().format()});

    res.status(200) // respond with 200

    res.send('Done');
});

// any actions on interactive buttons hit this url
// app.post('/choice', urlencodedParser, (req, res) => {
//     var reqBody = JSON.parse(req.body.payload);

//     // base url is appended with todays date
//     var base_url = 'month/' + moment().format('YYYY-MM') + '/day/' + moment().format('YYYY-MM-DD');

//     // Validate the request
//     if (validRequest(reqBody, res)) {

//         // Todays list
//         var newEntry = firebase.database().ref(base_url + '/people').push();

//         // Push to array 
//         newEntry.set({ time: moment().format(), user: reqBody.user.name, choice: reqBody.actions[0].value, object: reqBody });

//         // Increment the count for the day
//         firebase.database().ref(base_url + '/count').once('value').then(function (snapshot) {
//             count = snapshot.val() || {};
//             // if its not neither increment the value
//             if (reqBody.actions[0].value != 'neither') {
//                 count[reqBody.actions[0].value] = count[reqBody.actions[0].value] || 0;
//                 count[reqBody.actions[0].value]++;

//                 // Message that will send to channel
//                 var message = {
//                     "text": count.coffee + " Coffee and " + count.tea + " Tea will be served. \nGood Day guys! "
//                 }

//                 var responseURL = reqBody.response_url
//                 // send message to channel
//                 sendMessageToSlackResponseURL(responseURL, { replace_original: true, text: 'Roger that!.' });

//                 // for the first time we should postMessage , else update
//                 if (!count.ts) {
//                     var url = 'https://slack.com/api/chat.postMessage?token=' + process.env.token + '&channel=C3J6S2HGB&text=' + encodeURIComponent(JSON.stringify(message.text)) + '&pretty=1';
//                     request.get(url, function (status, response, body) {

//                         // save the timestamp of the message for update
//                         count.ts = JSON.parse(body).ts;
//                         // Save the count to firebase
//                         firebase.database().ref(base_url + '/count').update(count);
//                     });
//                 } else {
//                     var url = 'https://slack.com/api/chat.update?token=' + process.env.token + '&channel=C3J6S2HGB&ts=' + count.ts + '&text=' + encodeURIComponent(JSON.stringify(message.text)) + '&pretty=1';
//                     // Update the message on channel
//                     request.get(url, function (status, response, body) {
//                         firebase.database().ref(base_url + '/count').update(count);
//                     });
//                 }
//             }
//             res.status(200).end() // respond with 200
//         });
//     }
// });


/**
 * Function validates every request
 * 
 * @param {any} reqBody
 * @param {any} res
 */
function validRequest(reqBody, res) {
    if (reqBody.token != process.env.verificationToken) {
        res.status(403).end("Access forbidden")
        return false;
    } else {
        return true
    }
}

// Start listening  
app.listen(process.env.PORT || 8000);
