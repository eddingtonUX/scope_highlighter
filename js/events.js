function createTags(arr) {
	let tagId = 0;
	let output = document.getElementById("output");
	let numLines = document.editorField.lineCount();

	if (output.innerHTML != "") {
		output.removeChild(output.firstChild);
	}

	for (let i = 0; i < arr.length; i++) {
		var span = document.createElement("span");
		span.appendChild(document.createTextNode(arr[i]));
		span.className = "tag";
		span.setAttribute("id", "tag" + tagId++);
		span.addEventListener("mouseover", function(e) {
			e.target.style.backgroundColor = "yellow";
			for (let l = 0; l < numLines; l++) {
				let strCode = document.editorField.getLine(l);
				let strTag = e.target.innerHTML;
				if(document.editorField.getLine(l) == e.target.innerHTML) {
					document.editorField.addLineClass(l, "background", "hilite");
				};
			}
		});
		span.addEventListener("mouseout", function(e) {
			e.target.style.backgroundColor = "";
			for (let l = 0; l < numLines; l++) {
				let strCode = document.editorField.getLine(l);
				let strTag = e.target.innerHTML;
				if(document.editorField.getLine(l) == e.target.innerHTML) {
					document.editorField.removeLineClass(l, "background", "hilite");
				};
			}
		});
/*		span.addEventListener("click", function(e) {
			let numLines = document.editorField.lineCount();
			for (let l = 0; l < numLines; l++) {
				let strCode = document.editorField.getLine(l);
				let strTag = e.target.innerHTML;
				if(document.editorField.getLine(l) == e.target.innerHTML) {
					document.editorField.addLineClass(l, "background", "hilite");
				};
			}
			document.editorField.eachLine(function(line) {
				console.log(line);
				console.log(line.getLineNumber);
				console.log(e.target.innerHTML);
				// console.log("Line "+line+" is "+document.editorField.getLine(line));
				if(line.text == e.target.innerHTML) {
					document.editorField.addLineClass(line.order, "background", "hilite");
				};
			})
		});*/
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
	var options = {lineNumbers: true, mode: "javascript", theme: "base16-dark"};
	let cm = new CodeMirror.fromTextArea(myCode, options);
	document.editorField = cm;
	btn.addEventListener("click", parseCode, false);
}

window.onload = init;