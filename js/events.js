// JavaScript Variable Scope Highlighter
// For this assignment I created an app which parses simple JS code, finds variables,
// and shows their scope. I use two external libraries - CodeMirror for text editor
// and Acorn for JS code parsing. Acorn.parse creates an AbstractSyntaxTree.
// My AST traversal doesn't cover all types of nodes presented in the AST
// so it wouldn't work in some cases (for example, if the code contains arrow functions);
// although it would be fairly simple to add more types of nodes in the future.

// For variables storage I created a data structure which contains variable's name,
// and variable's scope (presented by two numbers, starting and ending position).
// As I go through the tree, I keep track of the current scope and if I find
// a variable, I push its name and scope into my array of variables. Each node in the
// AST has its position in the text (start and end character position) - that is how
// the scope is mapped to the input text.

// For my traversal function I use 3 arguments - node, blockScope and functionScope.
// Node represents current node, blockScope is an ancestor "block" node in which the 
// current node is nested, functionScope is an ancestor "function" node in which
// node is nested. We start traversing the tree with arguments (ast, ast, ast).
// In each iteration we narrow down the blockScope/functionScope if needed.


// Fulfilled requirements:
// - DOM element creation, deletion or modification
// - Capturing and handling events
// - Creating and handling a data structure
// - Closures


// Ways to improve
// Right now tags with variables in the output just show names, but in the future
// I plan on adding line numbers from the text editor for easier detection.
// Also I will add more types of nodes from AST to the traversal, so that more
// complex code could be analyzed.




// Data structures for scope highlighting
function Variable(varName, varScope) {
  this.name = varName;
  this.scope = varScope;
}

function Scope(start, end) {
	this.startPos = start;
	this.endPos = end;
}


// clears exisiting tags (spans in the "output")
function clearTags() {
	let output = document.getElementById("output");

	while (output.firstChild) {
		output.removeChild(output.firstChild);
	}
}


// creates spans for tags in the "output" div and adds event listeners
// for tags highlighting
function createTags(varArray) {
	let output = document.getElementById("output");

	clearTags();

	for (let i = 0; i < varArray.length; i++) {
		var span = document.createElement("span");
		span.appendChild(document.createTextNode(varArray[i].name));
		span.className = "tag";
		span.setAttribute("id", "tag" + i);

		// added closure for highlighting
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
	let variables = []; // here i store variables from AST

	let ast = acorn.parse(document.editorField.getValue(), {ecmaVersion: 2020});

	// recursive function which walks the AST (depth-first order) and 
	// populates an array of variables
	function walkAST(node, blockScope, functionScope) {
		if (!node) {
			// if the node is null, do nothing
			return;
		}
		// checks if this node introduces a new scope
		if (node.type == "BlockStatement") {
			blockScope = node;
		}
		if (node.type == "FunctionDeclaration") {
			functionScope = node;
		}
		// this is a variable, we need to store information about it
		if (node.type == "VariableDeclaration") {
			// get scope: if the variable is const or let, store blockScope
			let s = new Scope(blockScope.start, blockScope.end);
			// get scope: if the variable is var, change the scope to functionScope
			if (node.kind == "var") {
				s = new Scope(functionScope.start, functionScope.end);
			}
			// add the variable to the array
			let v = new Variable(node.declarations[0].id.name, s);
			variables.push(v);
			// initialization may contain variable declarations
			// for example, self-invoking function
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
		// traverse both sides of the expression
		if (node.type == "AssignmentExpression") {
			walkAST(node.left, blockScope, functionScope);
			walkAST(node.right, blockScope, functionScope);
			return;
		}
		// traverse init and body of for-loop
		if (node.type == "ForStatement") {
			walkAST(node.init, node, functionScope);
			walkAST(node.body, blockScope, functionScope);
			return;
		}
		if (node.type == "CallExpression") {
			walkAST(node.callee, blockScope, functionScope);
			return;
		}
		// traverse if and else
		if (node.type == "IfStatement") {
			walkAST(node.consequent, blockScope, functionScope);
			walkAST(node.alternate, blockScope, functionScope);
			return;
		}
		// some nodes contain multiple children
		// for example, blockStatement
		if (Array.isArray(node.body)) {
			node.body.forEach(child => walkAST(child, blockScope, functionScope));
		} else {
			walkAST(node.body, blockScope, functionScope);
		}
	}

	walkAST(ast, ast, ast);

	// create corresponding tags for populated array of variables
	createTags(variables);
}


function init() {
	var myCode = document.getElementById("myCode");
	var output = document.getElementById("output");
	var btn = document.getElementById("parseVariables");
	var options = {lineNumbers: true, mode: "javascript", theme: "base16-dark"};
	// create CodeMirror which replaces the textarea in the html body
	let cm = new CodeMirror.fromTextArea(myCode, options);
	document.editorField = cm;
	// add an event listener to clear output field if the editor's content has changed
	cm.on("change", clearTags);
	btn.addEventListener("click", parseCode, false);
}


window.onload = init;
