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

const port = 4001;

const fs = require('fs');
const modelIndex = JSON.parse(fs.readFileSync('./model-index.json'));
console.log(modelIndex);

var privateKey;
var certificate;
var ca;

let devMode = process.argv.length >= 3 ? (process.argv[2] == 'dev' ? true : false) : false;

if (devMode) {
	const http = require('http');
	const credentials = {};
	const server = http.createServer(credentials, app);
	server.listen(port, err => {
		if (err) console.error(err);
		console.log(`HTTP digit-classifier server running on port ${port}`);
	});
} else {
	const https = require('https');
	privateKey = fs.readFileSync('/etc/letsencrypt/live/yacoubahmed.me/privkey.pem', 'utf8');
	certificate = fs.readFileSync('/etc/letsencrypt/live/yacoubahmed.me/cert.pem', 'utf8');
	ca = fs.readFileSync('/etc/letsencrypt/live/yacoubahmed.me/chain.pem', 'utf8');
	const credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca,
		rejectUnauthorized: false
	};

	const secureServer = https.createServer(credentials, app);
	secureServer.listen(port, err => {
		if (err) console.error(err);
		console.log(`HTTPS digit-classifier server running on port ${port}`);
	});
}

app.get('*', (req, res) => {
	console.log(req.path);
	const path = req.params['0'];
	if (path == '/') {
		res.end(
			`<div>
                <h1>Keras Model Server</h1>
                <p>You shouldn't be back here!</p>
            </div>`
		);
		return;
	}
	if (path == '/index') {
		console.log('requested index');
		res.json(modelIndex);
		return;
	}
	const relPath = `.${path}`;
	console.log(`got model request: file ${relPath}`);
	if (fs.existsSync(relPath)) {
		const readStream = fs.createReadStream(relPath);
		readStream.pipe(res);
		return;
	} else {
		res.json({ error: `path ${relPath} doesn't exist` });
	}
});
