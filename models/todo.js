const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "資料必填!"],
		},
	},
	{
		versionKey: false,
	}
);

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
