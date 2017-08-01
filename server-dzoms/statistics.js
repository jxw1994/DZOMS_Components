module.exports = function(app){
	var basePath = __dirname;
	basePath = basePath.substring(0, basePath.lastIndexOf("\\"));
	app.get("/statistics/index", function(req, res) {
	  res.sendFile(basePath + '/statistics/index.html')
	})
}