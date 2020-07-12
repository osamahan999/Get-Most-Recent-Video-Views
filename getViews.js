const https = require('https');

/**
 * My apiKey, with the channelID you gave me and the max amount of videos that you provided.
 * Simply update the variables below for any changes youd like to make
 */
const apiKey = "AIzaSyA5RVpAo6B4JxDmKMRYL73Bl6ZM81wajnQ";
const channelID = "UCHnyfMqiRRG1u-2MsSQLbXA"; // for Veritasium
const maxVids = 3;

//Initial call that constructs the initial API call to get the three most recent videos' videoID
getRecentVideos(apiKey, channelID, maxVids);


/**
 * Calls getHttpData which performs the API call, with the callback function
 * getVideoIds which parses the json and gets the video ids.
 *  
 * @param {String} apiKey 
 * @param {String} channelId 
 * @param {Integer} maxVids 
 */
function getRecentVideos(apiKey, channelID, maxVids) {

    const videoIdUrl = 'https://www.googleapis.com/youtube/v3/search?key=' + apiKey + '&channelId=' + channelID + '&part=id&order=date&maxResults=' + maxVids;
    
    var callback = getVideoIds; //the name of the callback function
    getHttpData(videoIdUrl, callback);


}


/**
 * Takes JSON object and builds the videoID string for the second API call
 * 
 * @param {Object} dataOBJ 
 */
function getVideoIds(dataOBJ) {
    var videoIdString = "" ; // our string for video ids

    for (var i = 0; i < maxVids; i++) {
        videoIdString += dataOBJ.items[i].id.videoId; //adds the videoID from the object to the string
        if (i != maxVids - 1) videoIdString += ','; // if not the last videoID, add a comma. Makes HTTP request for views easier
    }

    const viewsUrl = 'https://www.googleapis.com/youtube/v3/videos?key=' + apiKey + '&part=statistics&id=' + videoIdString; //http request for views
    getHttpData(viewsUrl, printViews); //calls getHttp but with callback function printViews
}


/**
 * Takes the JSON object and prints the views of each video as a formatted number
 * @param {Object} dataOBJ 
 */
function printViews(dataOBJ) {
    for (var i = 0; i < maxVids; i++) {
         console.log(numberFormatting(dataOBJ.items[i].statistics.viewCount)); 
    } 
}


/**
 * Regex that adds commas in thousands formatting
 * 
 * @param {Integer} number 
 */
function numberFormatting(number) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}



/**
 * Returns an Object representing the JSON Data
 * @param {String} URL 
 */
function getHttpData(URL, callback) {

    https.get(URL, (response) => {
        let data = '';
      
        // Add all the chunks of data together
        response.on('data', (chunk) => {
          data += chunk;
        });
      

        // The whole response has been received, creates JSON object and calls callback function with object
        response.on('end', () => {
            var dataOBJ = JSON.parse(data);
            callback(dataOBJ);
            
        });
      

      }).on("error", (err) => {
        setDataOBJ("Error: " + err.message);
    });


}