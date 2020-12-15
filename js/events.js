function parseCode() {
	let myCode = document.getElementById("myCode");
	let output = document.getElementById("output");
	console.log(myCode.value);
	let linesArray = myCode.value.split("\n");
	console.log("Lines are: "+linesArray);
	output.innerHTML = myCode.value;
}


function init() {
	var myCode = document.getElementById("myCode");
	var output = document.getElementById("output");
	var btn = document.getElementById("parseVariables");
	btn.addEventListener("click", parseCode, false);
}

window.onload = init;