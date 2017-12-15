var fs = require('fs');
var http = require('http');
var qs = require('querystring');
var lineByLine = require('n-readlines');
var url = require('url');
var port = 9000;
var result_g;
function getJson(){
	var liner = new lineByLine('data/EMI Rates - Sheet1.csv');
	var line;
	var lineNumber = 0;
	var result = [];
	while (line = liner.next()) {	    
	    if(lineNumber > 1){
	      var obj = {};
		  var currentline=line.toString().split(",");
		  //console.log(currentline);
		  obj["bank"] = currentline[0];
		  var tenures = [];
		  var innerobj = {};
		  innerobj["months"] = currentline[1];
		  innerobj["rate"] = currentline[2];
		  innerobj["minimum_amount"] = currentline[3].split("\r")[0];
		  tenures.push(innerobj);
		  obj["tenures"] = tenures;

		  result.push(obj);
	    }
	    lineNumber++;

	}
	result_g = result;
	var json = JSON.stringify(result);
	//console.log("json==="+result);
	return json;
}

function getEmiSchemesOnAmount(json,param){
	/*var JefNode = require('json-easy-filter').JefNode;
	//var js = JSON.parse(json);
	var emiSchemes = new JefNode(json).filter(function(node) {
		//console.log("json= "+json);
		console.log("node in string "+ JSON.stringify(node));
		//	console.log(node.tenures);
		if (node.value.tenures.minimum_amount >= param.amount) {
			return node;
		}
	});
	return emiSchemes;*/
/*	var jsonQuery = require('json-query')
	var result = jsonQuery('[**][*minimum_amount] >= param.amount', {data: json}).value;
	console.log("After filter "+result);
	//var result = jsonQuery('grouped_people[**][*country=NZ]', {data: data}).value
	return result;*/


	/*var simpleJSONFilter = require("./index.js");
	var sjf = new simpleJSONFilter();
	sjf
		.filter({'minimum_amount >=': 'param.amount'})
		.data(json)
		.exec(); 
	var filter = {'minimum_amount >=': 'param.amount'};
	var result = sjf.exec(filter, json);*/

	/*var jp = require('jsonpath');
	console.log(json);
	var result = jp.query(json, '$.[*].tenures[?(@.minimum_amount>=1000)]');*/
	var filteredresult = [];
	for(var i=0;i<result_g.length;++i){
		var obj = result_g[i];
		var innerobj = obj["tenures"];
		//console.log("inner obj="+innerobj[0]["minimum_amount"] +" param amount =  "+param.amount);

		if(parseInt(innerobj[0]["minimum_amount"]) >= parseInt(param.amount)){
			filteredresult.push(obj);
		}

	}

	//console.log("After filter "+JSON.stringify(filteredresult));
	return JSON.stringify(filteredresult);
}
//var json;
function getHome(req,resp,json){
	
	resp.writeHead(200,{"Content-Type": "application/json"});
	resp.write(json);
	resp.end();
}
function get404(req,resp){
	resp.writeHead(404,"Resource not found",{"Content-Type": "text/html"});
	resp.write("<html><head><title>404</title></head><body>404</body></html>");
	resp.end();
}
function get405(req,resp){
	resp.writeHead(405,"Method not supported",{"Content-Type": "text/html"});
	resp.write("<html><head><title>405</title></head><body>405</body></html>");
	resp.end();
}

http.createServer(function (req, res) {
   var query = url.parse(req.url,true).query;
   var regex = new RegExp('\/emi-schemes\?');
   console.log("<<<<<<====>>>>>"+req.url);
   console.log("====>>>>>"+regex.test(req.url));
   var json = getJson();
   switch(req.method){
   	case "GET":
   		if(req.url === '/'){
   			getHome(req,res,json);
   		}else if(regex.test(req.url) == true){
   			console.log("emi schemes "+req.url);
   			var emi_schemes = getEmiSchemesOnAmount(json,query);
   			//console.log(emi_schemes);
   			res.writeHead(200,{"Content-Type": "application/json"});
			res.write(emi_schemes);
			res.end();

   		}else{
			get404(req,res);
   		}
   		break;
   	case "POST":
   		break;
   	default:
   		get405(req,res);
   		break;
   }
}).listen(port);


