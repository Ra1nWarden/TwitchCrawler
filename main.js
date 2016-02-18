var request = require('sync-request');
var fs = require('fs');
var moment = require('moment');
var excelbuilder = require('msexcel-builder');

var crawler = function(sheet) {
  var summaryRes =
    JSON.parse(
      request('GET',
              'https://api.twitch.tv/kraken/streams/summary').getBody());
  var topHundredRes =
    JSON.parse(
      request('GET',
              'https://api.twitch.tv/kraken/streams?limit=100').getBody());
  var idx = 1;
  topHundredRes.streams.forEach(function(stream) {
    var chan = stream.channel;
    // get channel name and viewers
    sheet.set(1, idx, chan.status);
    sheet.set(2, idx, stream.viewers);
    idx++;
  });
  sheet.set(1, 101, 'Total channels');
  sheet.set(2, 101, summaryRes.channels);
  sheet.set(1, 102, 'Total viewers');
  sheet.set(2, 102, summaryRes.viewers);
};

var crawl = function() {
  var dir = '.\\output';
  // create output folder
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  var time = moment();
  var timeString = time.format('YYYY-MM-DD_HH-mm-ss');
  var fileName = timeString + '.xlsx';
  var workbook = excelbuilder.createWorkbook('.\\output\\', fileName);
  var sheet = workbook.createSheet('data', 2, 102);
  crawler(sheet);
  workbook.save(function(err) {
    if(err) {
      console.log('Error!');
    }
  });
}

console.log('Crawling...Press ctrl + c to stop...')
crawl();
