#!/usr/bin/env node

// Made by George (geooot) Thayamkery in 2017
// Twitter: @geooot_       Website:geooot.com

var google = require('google')
var fs = require('fs')
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url');
var colors = require('colors');
var searchPostFix = "apush";
var args = process.argv.slice(2);
var obj = {};
if(args.length > 0){
	console.log("This may take a while...".yellow)
	google.resultsPerPage = 5;
	if(args[1] == "-s" && args[2] != null){
		searchPostFix = args[2];
	}
	fs.readFile(path.resolve(process.cwd(), args[0]), function(err, data){
		lookin = []
		if (err){
			console.log(("No file found: Using \"" + args[0] + "\" as the search term").yellow);
			lookin = [args[0]];
		}else{
			lookin = data.toString().split("\n");
		}		
		googleIt(lookin, 0);
		
	});

} else {
	console.log("Usage: qsearcher <file> [options]".cyan);
	console.log("Options:".cyan);
	console.log("\t-s [search term] default: \"apush\"".cyan);
	console.log("example: qsearcher vocab.txt -s \"history\"".cyan);
	console.log("cwd: ".cyan + process.cwd().cyan +"".cyan);
}

function googleIt(lookin, term){
	if(lookin.length == term || lookin[term] == "")
		return;
	google(lookin[term] + " " + searchPostFix + " quizlet", function (err, res){
		if (err != null && res == null){
			console.log("Error searching google (Probably temporarily IP blocked)".red);
			process.exit(1);
		}
		var found = false;
		for (var i = 0; i < res.links.length; ++i) {
			var link = res.links[i];
			var url = URL.parse(link.href);
			var doit=false;
			var diditonce = false;
			if(url.hostname == "quizlet.com" || url.hostname == "www.quizlet.com"){
				request.get(link.href, function (error, response, body) {
					if(!error){
						var $ = cheerio.load(body);
						$(".TermText").each(function(i){
							if(i % 2 == 0){
								if($(this).text().toLowerCase().includes(lookin[term].toLowerCase())){
									doit = true;
									console.log("\n");
									console.log((diditonce ? "(Related) ".bold.magenta:"") + $(this).text().bold.cyan);
									diditonce = true;
									found = true;
								}
							}else if(doit){
								console.log($(this).text());
								console.log((link.href).dim.underline);
								doit = false;
							}
						})
					}
				});
			}
		}
		if(!found)
			console.log(("Couldn't find anything for: " + lookin[term]).yellow)
		setTimeout(function(){
			googleIt(lookin, term+1);
		}, 2000);
	});
}
