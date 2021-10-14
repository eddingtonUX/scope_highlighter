# JavaScript variable scope highlighter (course project)

For this assignment I created an app which parses simple JS code, finds variables,
and shows their scope. I use two external libraries - CodeMirror for text editor
and Acorn for JS code parsing. `Acorn.parse` creates an `AbstractSyntaxTree`.
My AST traversal doesn't cover all types of nodes presented in the AST
so it wouldn't work in some cases (for example, if the code contains arrow functions);
although it would be fairly simple to add more types of nodes in the future.

For variables storage I created a data structure which contains variable's name,
and variable's scope (presented by two numbers, starting and ending position).
As I go through the tree, I keep track of the current scope and if I find
a variable, I push its name and scope into my array of variables. Each node in the
AST has its position in the text (start and end character position) - that is how
the scope is mapped to the input text.

For my traversal function I use 3 arguments - `node`, `blockScope`, and `functionScope`.
`Node` represents current node, `blockScope` is an ancestor "block" node in which the 
current node is nested, `functionScope` is an ancestor "function" node in which
node is nested. We start traversing the tree with arguments `(ast, ast, ast)`.
In each iteration we narrow down the `blockScope/functionScope` if needed.


## Fulfilled requirements:
- DOM element creation, deletion or modification
- Capturing and handling events
- Creating and handling a data structure
- Closures


## Ways to improve
Right now tags with variables in the output just show names, but in the future
I plan on adding line numbers from the text editor for easier detection.
Also I will add more types of nodes from AST to the traversal, so that more
complex code could be analyzed. 
