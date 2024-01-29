require("dotenv").config();

const CACHE_CLIENT_TOKEN = "akab-ekuydfanrbdsqbxs-5jfivcntn4b2vq6b"
const CACHE_CLIENT_SECRET = "enEKz5ax+uJcOvI0hJ5tk5m6BI5M3Zx5cCnxlNU9hU0="
const CACHE_ACCESS_TOKEN = "akab-ka5afhszpvy3elop-joq3i5mx2nfmmqch"
const CACHE_BASE_URI = "akab-g45ep6grmmbfeu5z-xgbdjtdoha4hsjl6.luna.akamaiapis.net"
// const GENERATED_FILES = process.env.PATH_FILES_TO_CLEAN.slice(0, -1);

var EdgeGrid = require("akamai-edgegrid");

console.log("======== Files being cleaning");
// let PATH_LIST = JSON.parse("[" + GENERATED_FILES + "]");
let PATH_LIST = [
    "https://media.sunglasshut.com/utilities/WebEFX/RTR/preview/SGH_Homepage/index.html",
    "https://media.sunglasshut.com/utilities/WebEFX/RTR/preview/SGH_Homepage/css/main.min.css",
    "https://media.sunglasshut.com/utilities/WebEFX/RTR/preview/SGH_Homepage/js/SGH_Homepage/main.min.js",
    "https://media.sunglasshut.com/utilities/WebEFX/RTR/preview/SGH_Homepage/json/SGH_Homepage/json.json",
]
console.log(PATH_LIST);

var eg = new EdgeGrid(CACHE_CLIENT_TOKEN, CACHE_CLIENT_SECRET, CACHE_ACCESS_TOKEN, CACHE_BASE_URI);

eg.auth({
    path: "/ccu/v3/delete/url/production",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: {
            objects: PATH_LIST
        }
    
});
    
eg.send(function(error, response, body) {
    if(response){
        console.log("======== Cache cleaned");
        // console.log(response);
    }
    if(error){
        console.log("========= Error on cleaning cache");
        // console.log(error.response.data);
    }
});