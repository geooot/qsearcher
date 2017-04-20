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
var printJSON = false;
if(args.length > 0){
	
	google.resultsPerPage = 5;
	if(args.indexOf("-s") > 0 && args[(args.indexOf("-s")+1)] != null){
		searchPostFix = args[2];
	}
	if(args.indexOf("-j") > 0){
		printJSON = true;
	}
	var letsPrint;
	if(printJSON){
		letsPrint = console.log;
		console.log = function(str){return;};
	}
	console.log("This may take a while...".yellow);
	fs.readFile(path.resolve(process.cwd(), args[0]), function(err, data){
		lookin = []
		if (err){
			console.log(("No file found: Using \"" + args[0] + "\" as the search term").yellow);
			lookin = [args[0]];
		}else{
			lookin = data.toString().split("\n");
		}		
		var terms = {};
		googleIt(lookin, 0, terms, function(dict){
			if(printJSON)
				letsPrint(JSON.stringify(dict));
		});

		
	});

} else {
	console.log();
	console.log("qsearcher v1.0.6         by: George Thayamkery".underline.cyan);
	console.log();
	console.log("Usage: qsearcher <file | searchTerm> [options]".cyan);
	console.log("Options:".cyan);
	console.log("\t-s [search term] default: \"apush\"".cyan);
	console.log("\t-j print out results in JSON format".cyan);
	console.log("example: qsearcher vocab.txt -s \"history\"".cyan);
	console.log("cwd: ".cyan + process.cwd().cyan +"".cyan);
}

function googleIt(lookin, term, dictionary, atEnd){
	if(lookin.length == term || lookin[term] == ""){
		atEnd(dictionary);
		return;
	}
	google(lookin[term] + " " + searchPostFix + " quizlet", function (err, res){
		if (err != null && res == null){
			console.log("Error searching google (Probably temporarily IP blocked)".red);
			process.exit(1);
		}
		var found = false;
		for (var i = 0; i < res.links.length; ++i) {
			var link = res.links[i];
			if(link.href == null){
				console.log("Invalid Link");
				continue;
			}
			var url = URL.parse(link.href);
			var doit=false;
			var diditonce = false;
			var currWord = "";
			if(url.hostname == "quizlet.com" || url.hostname == "www.quizlet.com"){
				request.get(link.href, function (error, response, body) {
					if(!error){
						var $ = cheerio.load(body);
						$(".TermText").each(function(i){
							if(i % 2 == 0){
								if($(this).text().toLowerCase().includes(lookin[term].toLowerCase())){
									doit = true;
									currWord = $(this).text();
									console.log("\n");
									console.log((diditonce ? "(Related) ".bold.magenta:"") + $(this).text().bold.cyan);
									diditonce = true;
									found = true;
								}
							}else if(doit){
								if(dictionary[lookin[term]] == null){
									dictionary[lookin[term]] = [];
								}
								dictionary[lookin[term]].push({"term":currWord,"definition":$(this).text(),"link":link.href});
								console.log($(this).text());
								console.log((link.href).dim.underline);
								doit = false;
							}
						})
					}
				});
			}
		}
		if(!found && term == (lookin.length -1))
			console.log(("Couldn't find anything for: " + lookin[term]).yellow)
		setTimeout(function(){
			googleIt(lookin, term+1, dictionary, atEnd);
		}, 2000);
	});
}
