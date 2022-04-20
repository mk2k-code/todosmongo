const http = require("http");
const headers  = require("../util/httpHeader");
const { errorHandle, resWriteData } = require("../util/httpMsg");
require("../db");
const Todo = require("../models/todo");
const todosControllers = require("../controllers/todos");

todos =[];
const routes = async (req, res) => {
    const { url, method } = req;
    console.log(method, url);

	let body = "";
	req.on("data", (chunk) => {
		body += chunk;
	});

	if (req.url == "/todos" && req.method == "GET") {
		todosControllers.getTodos(req, res, todos);

	} else if (req.url.startsWith("/todos/") && req.method == "GET") {
		todosControllers.getTodo(req, res, todos);

	} else if (req.url == "/todos" && req.method == "POST") {
		req.on("end", () => {
			todosControllers.postTodo(req, res, body);
		});

	} else if (req.url == "/todos" && req.method == "DELETE") {
		todosControllers.delTodos(req, res, todos);

	} else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
		todosControllers.delTodo(req, res);

	} else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
		req.on("end", () => {
			todosControllers.patchTodo(req, res, body);

		});
	} else if ((req.method = "OPTIONS")) {
		res.writeHead(200, headers);
		res.end();
	} else {
		errorHandle(req, res, 404);
	}
};

module.exports = routes;