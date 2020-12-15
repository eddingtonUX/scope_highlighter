function createTags(arr) {
	let tagId = 0;
	let output = document.getElementById("output");

	if (output.innerHTML != "") {
		output.removeChild(output.firstChild);
	}

	for (let i = 0; i < arr.length; i++) {
		var span = document.createElement("span");
		span.appendChild(document.createTextNode(arr[i] + " "));
		span.className = "tag";
		span.setAttribute("id", "tag" + tagId++);
		span.addEventListener("mouseover", function(e) {
			e.target.style.backgroundColor = "yellow";
		})
		span.addEventListener("mouseout", function(e) {
			e.target.style.backgroundColor = "";
		})
		output.appendChild(span);
	}
}


function parseCode() {
	let myCode = document.getElementById("myCode");
	let output = document.getElementById("output");
	console.log(document.editorField.getValue());
	let linesArray = document.editorField.getValue().split("\n");
	console.log("Lines are: "+linesArray);
	output.innerHTML = document.editorField.getValue();
	createTags(linesArray);
}


function init() {
	var myCode = document.getElementById("myCode");
	var output = document.getElementById("output");
	var btn = document.getElementById("parseVariables");
	var options = {lineNumbers: true, mode: "javascript"};
	let cm = new CodeMirror.fromTextArea(myCode, options);
	document.editorField = cm;
	btn.addEventListener("click", parseCode, false);
}

window.onload = init;