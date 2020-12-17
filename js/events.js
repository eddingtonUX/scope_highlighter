function variable(varName, varScope) {
  this.name = varName;
  this.scope = varScope;
}


function getVarScope(tree) {
	let names = [];
	return //var names;
}

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

		var highlight = (function(el) {
			return {
			    add: function() {
			    	el.style.backgroundColor = "yellow";
			    	for (let l = 0; l < numLines; l++) {
						if(document.editorField.getLine(l) == el.innerHTML) {
						document.editorField.addLineClass(l, "background", "hilite");
						}
					}
			    },
			    remove: function() {
			    	el.style.backgroundColor = "";
			    	for (let l = 0; l < numLines; l++) {
						if(document.editorField.getLine(l) == el.innerHTML) {
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
	let variables = [];

	let ast = acorn.parse(document.editorField.getValue(), {ecmaVersion: 2020});
	console.log(ast);

	function walkAST(node, blockScope, functionScope) {
		if (!node) {
			// if the node is null, do nothing
			return;
		}
		if (node.type == "BlockStatement") {
			blockScope = node;
		}
		if (node.type == "FunctionDeclaration") {
			functionScope = node;
		}
		if (node.type == "VariableDeclaration") {
			// get scope
			// let varN = new variable(node.declarations[0].id.name, ast.node[i].scope);
			// variables.push(varN);
			walkAST(node.declarations[0].init, blockScope, functionScope);
			return;
		}
		if (node.type == "EmptyStatement") {
			return;
		}
		if (node.type == "Identifier") {
			return;
		}
		if (node.type == "Literal") {
			return;
		}
		if (node.type == "ExpressionsStatement") {
			walkAST(node.expression, blockScope, functionScope);
			return;
		}
		if (node.type == "AssignmentExpression") {
			walkAST(node.left, blockScope, functionScope);
			walkAST(node.right, blockScope, functionScope);
			return;
		}
		if (node.type == "ForStatement") {
			walkAST(node.init, node, functionScope);
			walkAST(node.body, blockScope, functionScope);
			return;
		}
		if (node.type == "CallExpression") {
			walkAST(node.callee, blockScope, functionScope);
			return;
		}
		if (node.type == "IfStatement") {
			walkAST(node.consequent, blockScope, functionScope);
			walkAST(node.alternate, blockScope, functionScope);
			return;
		}
		if (Array.isArray(node.body)) {
			node.body.forEach(child => walkAST(child, blockScope, functionScope));
		} else {
			walkAST(node.body, blockScope, functionScope);
		}
	}


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
