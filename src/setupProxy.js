const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		'/sparql-endpoint',
		createProxyMiddleware({
			
			//target: 'http://localhost:9999/blazegraph/namespace/kb/sparql',  // local
			//target: 'http://blazegraph:8080/blazegraph/namespace/kb/sparql', // server
			target: 'http://arca.diag.uniroma1.it:9999/blazegraph/namespace/kb/sparql', // online
			changeOrigin: true,
			pathRewrite: {
				'^/sparql-endpoint': '',
			},
			secure: false,
			timeout: 20000,
			headers: {
				Connection: 'keep-alive',
			},
		})
	);
	app.use(
		'/dbpedia',
		createProxyMiddleware({
			target: 'http://dbpedia.org/sparql',
			changeOrigin: true,
			pathRewrite: {
				'^/dbpedia': '',
			},
			secure: false,
			timeout: 20000,
			headers: {
				Connection: 'keep-alive',
			},
		})
	);
};
