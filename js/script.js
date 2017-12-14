
function loadDoc(data) {
	  var xhttp = new XMLHttpRequest();
	  xhttp.open("POST", "http://localhost:8080/", true);
	  //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	  xhttp.send(data);
}
function doStuff(data) {
    var lines= data;
    var result = [];
  	var headers=lines[0].toString().split(",");

  	for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].toString().split(",");
	  obj["bank"] = currentline[0];
	  var tenures = [];
	  //for(var j=0;j<lines[1].length/3;j++){
	  var innerobj = {};
	  innerobj["months"] = currentline[1];
	  innerobj["rate"] = currentline[2];
	  innerobj["minimum_amount"] = currentline[3];
	  //}
	  tenures.push(innerobj);
	  obj["tenures"] = tenures;

	  result.push(obj);

  }
  //return result; //JavaScript object
   	console.log(JSON.stringify(result));
   	/*var jsonFile = "emi_schemes.json";
	var file = new File([""],jsonFile);
 
	file.open("w"); // open file with write access
	file.write(JSON.stringify(result));
	file.close();*/
   //loadDoc(JSON.stringify(result));
   //return JSON.stringify(result); 
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