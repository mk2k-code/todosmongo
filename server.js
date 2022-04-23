const http = require("http");
const routes = require("./routes");
const port = process.env.PORT || 3006;


const app = async (req, res) => {
	routes(req, res);
};
console.log(`HEROKU_APP_NAME: ${process.env.HEROKU_APP_NAME}`);
console.log(`process.env.REDISTOGO_URL: ${process.env.REDISTOGO_URL}`);


const server = http.createServer(app);
server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/todos`);
});
