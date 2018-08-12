require("dotenv").config();
var spotify = new Spotify({
    id: "2892ce800c6240dead02c9f5f01cbea9",
    secret: "1ae362fdeeea458cb70c341a57695a54"
});
var client = new Twitter(keys.twitter);
var keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var input = process.argv;
var action = process.argv[2];
var inputs = process.argv[3];

switch(action) {
    case "my-tweets":
    twitter(inputs);
    break;

    case "spotify-this-song":
    spotify(inputs);
    break;

    case "movie-this":
    movie(inputs);
    break;

    case "do-what-it-says":
    doit();
    break;

};

function twitter(inputs) {
    var params = {
        screen_name: inuts,
        count: 20
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error){
            for (i=0; i<tweets.length; i++){
                console.log("twee:" + tweets[i].text + "created At: " + tweets[i].created_at);
            }
        } else {
            console.log(error);
        }
    });
}

function spotify(inputs) {
    var spotify = new Spotify(keys.spotifykeys);
    if (!inputs){
        inputs =  "The Sign";
    }
    spotify.search({
        type:"track",
        query: inputs
    }, function(err,data){
        if (err){
            console.log("there is an error" + err);
            return;
        }
        var songInfo = data.tracks.items;
        console.log("Artist: " + songInfo[0].artists[0].name);
        console.log("Song name: " + songInfo[0].name);
        console.log("Link: " + songInfo[0].preview_url);
        console.log("Album " + songInfo[0].album.name);
        
    });
}

function movie(inputs) {
    var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=d1fb3995";
    request(queryUrl, function(error, response, body) {
        if (!inputs){
            inputs = "Mr. Nobody";
        }
        if (!error && response.statusCode === 200) {
            console.log("Title " + JSON.parse(body).Title);
            console.log("Realese Year: " + JSON.parse(body).year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
};

function doit() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        if (dataArr[0] === "spotify-this-song") {
            var songcheck = dataArr[1].slice(1, -1);
            spotify(songcheck);
        } else if (dataArr[0] === "my-tweets") {
            var tweetname = dataArr[1].slice(1, -1);
            twitter(tweetname);
        } else if (dataArr[0] === "movie-this") {
            var movie_name = dataArr[1].slice(1, -1);
            movie(movie_name);
        }
    });
};
