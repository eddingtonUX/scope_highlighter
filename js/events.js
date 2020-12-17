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

		var highlight = (function(s) {
			return {
			    add: function() {
			    	s.style.backgroundColor = "yellow";
			    	for (let l = 0; l < numLines; l++) {
						if(document.editorField.getLine(l) == s.innerHTML) {
						document.editorField.addLineClass(l, "background", "hilite");
						}
					}
			    },

			    remove: function() {
			    	s.style.backgroundColor = "";
			    	for (let l = 0; l < numLines; l++) {
						if(document.editorField.getLine(l) == s.innerHTML) {
						document.editorField.removeLineClass(l, "background", "hilite");
						}
					}
			    }
			};
		})(span);

		span.onmouseover = highlight.add;
		span.onmouseout = highlight.remove;

		output.appendChild(span);
	}
}


function parseCode() {
	let myCode = document.getElementById("myCode");
	let output = document.getElementById("output");
	let linesArray = document.editorField.getValue().split("\n");
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
