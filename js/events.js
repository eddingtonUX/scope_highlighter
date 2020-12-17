// Data structure for scope highlighting
function Variable(varName, varScope) {
  this.name = varName;
  this.scope = varScope;
}

function Scope(start, end) {
	this.startPos = start;
	this.endPos = end;
}


function clearTags() {
	let output = document.getElementById("output");

	while (output.firstChild) {
		output.removeChild(output.firstChild);
	}
}


function createTags(varArray) {
	let output = document.getElementById("output");

	clearTags();

	for (let i = 0; i < varArray.length; i++) {
		var span = document.createElement("span");
		span.appendChild(document.createTextNode(varArray[i].name));
		span.className = "tag";
		span.setAttribute("id", "tag" + i);

		var highlight = (function(el) {
			return {
			    add: function() {
			    	el.style.backgroundColor = "yellow";
			    	let index = parseInt(el.id.substr(3));
		    		let s = varArray[index].scope;
		    		let editor = document.editorField;
		    		editor.markText(
		    			editor.posFromIndex(s.startPos),
		    			editor.posFromIndex(s.endPos),
		    			{className: "hilite"});
			    },
			    remove: function() {
			    	el.style.backgroundColor = "";
			    	let editor = document.editorField;
			    	editor.getAllMarks().forEach(marker => marker.clear());
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
			let s = new Scope(blockScope.start, blockScope.end);
			if (node.kind == "var") {
				s = new Scope(functionScope.start, functionScope.end);
			}
			let v = new Variable(node.declarations[0].id.name, s);
			variables.push(v);
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
	walkAST(ast, ast, ast);

	createTags(variables);
}


function init() {
	var myCode = document.getElementById("myCode");
	var output = document.getElementById("output");
	var btn = document.getElementById("parseVariables");
	var options = {lineNumbers: true, mode: "javascript", theme: "base16-dark"};
	let cm = new CodeMirror.fromTextArea(myCode, options);
	document.editorField = cm;
	cm.on("change", clearTags);
	btn.addEventListener("click", parseCode, false);
}


window.onload = init;
