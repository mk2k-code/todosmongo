const http = require("http");
const fetch = require("cross-fetch");
const headers = require("../util/httpHeader");
const { errorHandle, resWriteData } = require("../util/httpMsg");
require("../db");
const Todo = require("../models/todo");
const Post = require("../models/post");
const todosControllers = require("../controllers/todos");
const postsControllers = require("../controllers/posts");

todos = [];
posts = [];
const routes = async (req, res) => {
	const { url, method } = req;
	console.log(method, url);

	let body = "";
	req.on("data", (chunk) => {
		body += chunk;
	});

	if (req.url.startsWith("/todos")) {
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
	} else if (req.url.startsWith("/posts")) {
		if (req.url == "/posts" && req.method == "GET") {
			postsControllers.getPosts(req, res, posts);
		} else if (req.url.startsWith("/posts/") && req.method == "GET") {
			postsControllers.getPost(req, res, posts);
		} else if (req.url == "/posts" && req.method == "POST") {
			req.on("end", () => {
				postsControllers.postPost(req, res, body);
			});
		} else if (req.url == "/posts" && req.method == "DELETE") {
			postsControllers.delPosts(req, res, posts);
		} else if (req.url.startsWith("/posts/") && req.method == "DELETE") {
			postsControllers.delPost(req, res);
		} else if (req.url.startsWith("/posts/") && req.method == "PATCH") {
			req.on("end", () => {
				postsControllers.patchPost(req, res, body);
			});
		} else if ((req.method = "OPTIONS")) {
			res.writeHead(200, headers);
			res.end();
		} else {
			errorHandle(req, res, 404);
		}
	} else if (req.url == "/ip" && req.method == "GET") {
		const url = "https://api.ipify.org?format=json";
		const myHost = "polar-reaches-82211.herokuapp.com";
		console.log("-----");
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				// console.log("-----");
				myApp = {
					host: myHost,
					ip: data.ip,
				};
				resWriteData(res, myApp);
			})
			.catch((error) => console.log(error, 2));
	} else if ((req.method = "OPTIONS")) {
		res.writeHead(200, headers);
		res.end();
	} else {
		errorHandle(req, res, 404);
	}
};

module.exports = routes;
