const app = require('express')();
const cors = require('cors');

var allowedOrigins = ['http://localhost:3000', 'https://yacoubahmed.me'];
app.use(
	cors({
		origin: function(origin, callback) {
			// allow requests with no origin
			// (like mobile apps or curl requests)
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				var msg = 'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		}
	})
);
const fs = require('fs');
const http = require('http');
const port = 4001;
const credentials = {};
const server = http.createServer(credentials, app);
server.listen(port, err => {
	if (err) console.error(err);
	console.log(`HTTP digit-classifier server running on port ${port}`);
});

app.get('/', (req, res) => {
	res.end(
		`<div>
			<h1>Keras Model Server</h1>
			<p>You shouldn't be back here!</p>
		</div>`
	);
});

app.get('/model', (req, res) => {
	res.json(JSON.parse(fs.readFileSync('./converted_model/model.json')));
});

app.get('/metadata', (req, res) => {
	res.json(JSON.parse(fs.readFileSync('./converted_model/metadata.json')));
});

// app.get('/binaries', (req, res) => {
// 	console.log(req);
// });

app.get('/group1-shard1of1.bin', (req, res) => {
	const readStream = fs.createReadStream('./converted_model/group1-shard1of1.bin');
	readStream.pipe(res);
});

app.get('/group1-shard1of2.bin', (req, res) => {
	const readStream = fs.createReadStream('./converted_model/group1-shard1of2.bin');
	readStream.pipe(res);
});

app.get('/group1-shard2of2.bin', (req, res) => {
	const readStream = fs.createReadStream('./converted_model/group1-shard2of2.bin');
	readStream.pipe(res);
});
