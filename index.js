var express = require("express");
var alexa = require("alexa-app");
var Speech = require("ssml-builder");

var PORT = process.env.PORT || 8088;
var app = express();

// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app("test");

alexaApp.express({
  expressApp: app,
  //router: express.Router(),

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: true,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: true
});

// now POST calls to /test in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
app.set("view engine", "ejs");

alexaApp.launch(function(request, response) {
  response.say("You launched the app!");
});



// alexaApp.intent("nameIntent", {
//     "slots": { "NAME": "LITERAL" },
//     "utterances": [
//       "my {name is|name's} {names|NAME}", "set my name to {names|NAME}"
//     ]
//   },
//   function(request, response) {
//     response.say("Success!");
//   }
// );

alexaApp.intent("RollDice", {
  "slots": { "diceQuantity": "AMAZON.NUMBER", "sideQuantity" : "AMAZON.NUMBER" },
  "utterances": [
    "tire {diceQuantity} dados de {sideQuantity} caras", "tire el dado"
  ]
},
function(request, response) {  
  var speech = new Speech();    
  ;
      var diceQuantity = (request.slots["diceQuantity"].value ? parseInt(request.slots["diceQuantity"].value) : 1);
      var sideQuantity = (request.slots["sideQuantity"].value ? parseInt(request.slots["sideQuantity"].value) : 6);
      var results = [];
      for (i = 1; i <= diceQuantity; i++){
        results.push(randomIntFromInterval(1, sideQuantity));
      }
      speech.audio("soundbank://soundlibrary/musical/amzn_sfx_drum_comedy_01")
            .say("Ha salido");
      results.forEach(function(result, idx, array){
        if(idx === array.length -1) speech.say("y");
        speech.say(result.toString()).pause('500ms');        
      });
      var speechOutput = speech.ssml(true);
      response.say(speechOutput);
}
);

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));
app.use('/resources', express.static(__dirname + '/resources'));
function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}