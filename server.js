var http = require('http');
var express = require('express');

var app = require('express')();

app.use(express.static(__dirname + '/public'));

Date.prototype.getWeekRange = function(start) {

var worldRankings = {};
var prevWeekResults = {};

    start = start || 0;
    var today = new Date();
    var day = today.getDay() - start;
    var date = today.getDate() - day;

    var StartDate = new Date(today.setDate(date));
    var EndDate = new Date(today.setDate(date + 6));
    return {startDate: StartDate, endDate: EndDate};
}

var dateRange = new Date().getWeekRange(1);
http.get("http://cmsapi.pulselive.com/rugby/rankings/mru?language=en", function(res) {
	var data = "";
	
	res.on('data', function (chunk){
        data += chunk;
    });

    res.on('end',function(){
        worldRankings = JSON.parse(data);
    })
});

http.get("http://cmsapi.pulselive.com/rugby/match?endDate=" + dateRange.endDate.toISOString().slice(0,10) + "&startDate=" + dateRange.startDate.toISOString().slice(0,10) + "&sort=desc&states=C&pageSize=100&client=pulse", function(res) {
//For testing: http.get("http://cmsapi.pulselive.com/rugby/match?endDate=2015-09-27&startDate=2015-09-21&sort=desc&states=C&pageSize=100&client=pulse", function(res) {
	var data = "";
	
	res.on('data', function (chunk){
        data += chunk;
    });

    res.on('end',function(){
        prevWeekResults = JSON.parse(data);
    })
});

app.get("/api/rankings", function(req, res) {
    console.log("GET: Rankings");
	
    res.json(worldRankings);
});

app.get('/api/prevWeekResults', function(req, res) {
	console.log("GET: Last week results");
	
	res.json(prevWeekResults);
});


app.listen(3000);

/*
Gets last week's rugby results:
http://cmsapi.pulselive.com/rugby/match?endDate=2015-09-27&startDate=2015-09-21&sort=desc&states=C&pageSize=100&client=pulse
*/