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
	console.log(myCode.value);
	let linesArray = myCode.value.split("\n");
	console.log("Lines are: "+linesArray);
	output.innerHTML = myCode.value;
	createTags(linesArray);
}


function init() {
	var myCode = document.getElementById("myCode");
	var output = document.getElementById("output");
	var btn = document.getElementById("parseVariables");
	let cm = new CodeMirror.fromTextArea(document.getElementById("output"), {
		lineNumbers: true,
		mode: "javascript",
		theme: "dracula"
	});
	btn.addEventListener("click", parseCode, false);
}

window.onload = init;