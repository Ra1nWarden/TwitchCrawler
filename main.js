var request = require('sync-request');
var fs = require('fs');
var sleep = require('sleep');
var moment = require('moment');

var crawler = function(fileName) {
  var summaryRes =
    JSON.parse(
      request('GET',
              'https://api.twitch.tv/kraken/streams/summary').getBody());
  fs.appendFileSync(fileName, 'total channels: ' + summaryRes.channels + '\n' + 'total viewers: ' + summaryRes.viewers + '\n');
  var topHundredRes =
    JSON.parse(
      request('GET',
              'https://api.twitch.tv/kraken/streams?limit=100').getBody());
  topHundredRes.streams.forEach(function(stream) {
    var chan = stream.channel;
    fs.appendFileSync(fileName, chan.display_name + ',' + stream.viewers + '\n');
  });
  console.log('Finished writing to ' + fileName);
};

var crawl = function() {
  var dir = './output';
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  while(true) {
    var time = moment();
    var timeString = time.format('YYYY-MM-DD_HH-mm');
    var fileName = dir + '/' + timeString + '.txt';
    fs.writeFileSync(fileName, time.format('MMMM Do YYYY, h:mm:ss a') + '\n');
    crawler(fileName);
    sleep.sleep(300);
  }
}

console.log('Crawling...Press ctrl + c to stop...')
crawl();
