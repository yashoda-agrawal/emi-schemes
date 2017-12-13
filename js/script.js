

function doStuff(data) {
    var lines= data;
    var result = [];
  	var headers=lines[0].toString().split(",");

  	for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].toString().split(",");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }

	  result.push(obj);

  }
  //return result; //JavaScript object
  console.log(JSON.stringify(result));
  return JSON.stringify(result); 
}

function parseData(url, callBack) {
    Papa.parse(url, {
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            callBack(results.data);
        }
    });
}

parseData("data/EMI Rates - Sheet1.csv", doStuff);