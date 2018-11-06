var express = require("express");
var alexa = require("alexa-app");
var Speech = require("ssml-builder");

var PORT = process.env.PORT || 8080;
var app = express();

// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app("test");

alexaApp.express({
  expressApp: app,
  //router: express.Router(),

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: false,

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
      speech.audio("resources/dice.mp3");
      var diceQuantity = (request.slots["diceQuantity"] == "NONE" ? 1 : int.parse(request.slots["diceQuantity"]));
      var sideQuantity = (request.slots["sideQuantity"] == "NONE" ? 6 : int.parse(request.slots["sideQuantity"]));
      var results = [];
      for (i = 1; i <= diceQuantity; i++){
        results.push(randomIntFromInterval(1, sideQuantity));
      }
      response.say("Ha salido");
      results.forEach(function(result){
        response.say(result).pause('500ms');
      })
}
);

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}