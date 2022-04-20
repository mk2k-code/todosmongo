const Todo = require("../models/todo");
const headers = require("../util/httpHeader");
const { errorHandle, resWriteData } = require("../util/httpMsg");

const todos = {
	async getTodos(req, res, todos) {
		todos = await Todo.find();
		resWriteData(res, todos);
	},

	async getTodo(req, res, todos){
		try {
			const id = req.url.split("/").pop();
			const todo = await Todo.findById(id);
			if (todo !== undefined) {
				resWriteData(res, todo);
			} else {
				errorHandle(req, res, 40001);
			}
			
		} catch (error) {
			errorHandle(req, res, 40002);
		};
	},

	async postTodo(req, res, body){
		try {
			const title = JSON.parse(body).title;
			console.log(title);
			if (title !== undefined) {
				const todo = await Todo.create({ title: title });
				resWriteData(res, todo);
			} else {
				errorHandle(req, res, 40001);
			}
			
		} catch (error) {
			errorHandle(req, res, 40002);
		};
	},

	async delTodos(req, res, todos) {
		todos = await Todo.deleteMany({});
		resWriteData(res, todos);
	},

	async delTodo(req, res) {
		try {
			const id = req.url.split("/").pop();
			const todo = await Todo.findById(id);
			if (todo !== null) {
				await Todo.findByIdAndDelete(id)
					.then(() => {
						resWriteData(res, todo);
						console.log("刪除成功");
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				errorHandle(req, res, 40001);
			}
		} catch (error) {
			errorHandle(req, res, 40002);
		}
	},

	async patchTodo(req, res, body) {
		try {
			const id = req.url.split("/").pop();
			const title = JSON.parse(body).title;
			const todo = await Todo.findById(id);
			const todoUpdate = {
				id: id,
				title: title,
			};
			if (todo !== null && title !== undefined) {
				await Todo.findByIdAndUpdate(id, { title: title })
					.then(() => {
						resWriteData(res, todoUpdate);
						console.log("更新成功");
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				errorHandle(req, res, 40001);
			}
		} catch (error) {
			errorHandle(req, res, 40002);
		}
	},

}


// module.exports = { todos}; XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
module.exports = todos;
