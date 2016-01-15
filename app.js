/**
 * Created by mung on 2016-01-13.
 */

var assert  = require('assert'),
    fs = require('fs');
    superagent = require('superagent');
    expect = require('expect');
var expected, current;
var mysql = require('mysql');
var Promise = require('promise');

var client = mysql.createConnection({ //¢¯U¨¬I DB
	user:'*',
	host:'*',
	database:'*',
	password:'*'
});
var client2 = mysql.createConnection({ //¡¤IAA DB
	user:'*',
	database:'*',
	password:'*'
});

var time = require('node-google-timezone');

var getFromLTC = function(lat, lng, utc,num){
	return new Promise(function(resolve, reject) {
		time.data(lat,lng,utc,function(err,tz){
			if(!err){
				resolve({fromLTC:tz.local_timestamp, num:num});
			}else{
				reject(err);
			}
		})
	});

};

var getToLTC = function(lat, lng, utc, id){
	return new Promise(function(resolve, reject) {
		time.data(lat,lng,utc,function(err,tz){
			if(!err){
				resolve({toLTC:tz.local_timestamp, id: id});
			}else{
				reject(err);
			}
		})
	});

};
//1132571986772335, 1674200689483422 619930534812763
client.query('SELECT *FROM userinfo WHERE id="619930534812763" || id="1674200689483422" || id="1132571986772335"',function(err,userinfo){
	if(!err) {
		var c=0;
		for(var i in userinfo) {
			(
			Promise.all([getToLTC(38.8833, -77.0333, new Date() / 1000, userinfo[i].id), getFromLTC(userinfo[i].latitude, userinfo[i].longitude, new Date() / 1000,i)])
				.then(function (LTC) {
					console.log('first');
					console.log(LTC);
					client2.query('SELECT *FROM test1',function(err,data){
						if(!err) {
							c++
							console.log('asd'+c );
							;console.log( c === userinfo.length - 1)
							if (c === userinfo.length - 1)  {console.log ('res.json()');return LTC;}
						}else{
							console.log(err);
						}
					})

				})
				.then(function (text) {
					if(text) {
						console.log("finally");
						console.log(text);
					}

				})
			)
		}
	}else{
		console.log(err);
	}
});