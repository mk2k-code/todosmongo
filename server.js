const http = require('http');
const {headers} = require("./httpHeader");
const {errorHandle, resWriteData} = require("./httpMsg");
require("./mongo");
const Todo = require("./models/todo");
const port = process.env.PORT || 3006;

todos = [];
const requestListener = async (req, res) => {
	let body = "";
	req.on("data", (chunk) => {
		body += chunk;
	});

	if(req.url == "/todos" && req.method == "GET"){
		todos = await Todo.find();
		resWriteData(res, todos);
	}else if(req.url == "/todos" && req.method == "POST"){
		req.on("end", async ()=> {
			try {
				const title = JSON.parse(body).title;
				if (title !== undefined){
					const todo = await Todo.create({title: title});
					resWriteData(res, todo);
				}else{
					errorHandle(res, 40001);
					// return false;
				}
			} catch (error) {
				errorHandle(res, 40002);
			}
		});
	}else if(req.url == "/todos" && req.method == "DELETE"){
		todos = await Todo.deleteMany({});
		resWriteData(res, todos);
	}else if(req.url.startsWith("/todos/") && req.method == "DELETE"){
		try {
			const id = req.url.split("/").pop();
			const todo = await Todo.findById(id);
			if(todo !== null){
				await Todo.findByIdAndDelete(id)
				.then(()=>{
					resWriteData(res, todo);
					console.log("刪除成功");
				})
				.catch((error)=>{
					console.log(error);
				});
			}else{
				errorHandle(res, 40001);
			}
		} catch (error) {
			errorHandle(res, 40002);
		}	
	}else if(req.url.startsWith("/todos/") && req.method == "PATCH"){
		req.on("end", async () => {
			try {
				const id = req.url.split("/").pop();
				const title = JSON.parse(body).title;
				const todo = await Todo.findById(id);
				const todoUpdate ={
					id: id,
					title: title,
				}
				if (todo !== null && title !== undefined){
					await Todo.findByIdAndUpdate(id,{title:title})
					.then(()=>{
						resWriteData(res, todoUpdate);
						console.log("更新成功");
					})
					.catch((error)=>{
						console.log(error);
					});
				}else{
					errorHandle(res, 40001);
				}	
			} catch (error) {
				errorHandle(res, 40002);
			}
		});
	}else if((req.method = "OPTIONS")){
		res.writeHead(200, headers);
		res.end();
	}else{
		errorHandle(res, 404);
	}
};

const server = http.createServer(requestListener);
server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/todos`);
});

