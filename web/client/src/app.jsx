import React, { Component } from 'react';
import { Typography, Container } from '@material-ui/core';
import * as tf from '@tensorflow/tfjs';
import DisplayCard from './displayCard';
import DrawingCard from './drawingCard';

var model;
var xhr;
const serverAddress = 'http://192.168.0.13:3003';

class App extends Component {
	constructor(props) {
		super(props);
		let landscape = window.innerWidth * 0.8 > window.innerHeight;
		let cardWidth = 0;
		if (landscape) {
			cardWidth = window.innerWidth * 0.25;
			cardWidth = cardWidth - (cardWidth % 28);
		} else {
			cardWidth = window.innerWidth * 0.6;
			cardWidth = cardWidth - (cardWidth % 28);
		}
		this.state = {
			model: 'loading',
			metadata: {},
			grid: [],
			shouldPredict: false,
			result: undefined,
			confidence: 0,
			confidenceList: [],
			expected: '',
			padSize: cardWidth,
			landscape: landscape
		};

		model = tf.loadLayersModel(serverAddress + '/model');
		model
			.then(value => {
				this.setState({ model: value });
			})
			.catch(reason => {
				this.setState({ model: 'failed' });
				console.error(reason);
			});

		this.getMetadata();
	}

	componentDidMount() {
		this.resizeHandler();
		window.addEventListener('resize', this.resizeHandler);
	}

	getMetadata = () => {
		xhr = new XMLHttpRequest();
		var url = serverAddress + '/metadata';
		xhr.open('GET', url, true);
		xhr.send();

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var jsonData = JSON.parse(xhr.responseText);
				this.setState({ metadata: jsonData });
			}
		};
	};

	resizeHandler = () => {
		let landscape = window.innerWidth * 0.8 > window.innerHeight;
		let cardWidth = 0;
		if (landscape) {
			cardWidth = window.innerWidth * 0.25;
			cardWidth = cardWidth - (cardWidth % 28);
		} else {
			cardWidth = window.innerWidth * 0.6;
			cardWidth = cardWidth - (cardWidth % 28);
		}
		this.setState({ landscape: landscape, padSize: cardWidth });
	};

	renderToGrid = (grid, shouldPredict) => {
		this.setState({ grid: grid, shouldPredict: shouldPredict });
	};

	renderedToGrid = () => {
		if (!this.state.shouldPredict) {
			this.setState({ result: undefined, confidence: 0, confidenceList: [] });
			return;
		}
		// we have to rotate the pixel grid since MNIST data is ordered differently
		let flippedGrid = [];
		for (let x = 0; x < this.state.grid.length; x++) {
			let col = [];
			for (let y = 0; y < this.state.grid[x].length; y++) {
				// insert pixels the other way round
				// we also insert pixels contained in a [array] to match the reshaping done during training
				col.push([this.state.grid[y][x]]);
				// col.push(this.state.grid[y][x]);
			}
			flippedGrid.push(col);
		}
		// let tensorGrid = tf.tensor3d([flippedGrid]);
		let tensorGrid = tf.tensor4d([flippedGrid]);
		const prediction = this.state.model.predict(tensorGrid);
		const result = tf.argMax(prediction, 1).dataSync()[0];
		var tList = prediction.dataSync();
		tList = Array.prototype.slice.call(tList);
		let confidence = Math.round(tList[result] * 1000) / 10.0;
		tList = tList.map((val, idx) => [Math.round(val * 1000.0) / 10.0, idx]);
		tList = tList.filter(val => val[0] > 0.1);
		tList = tList.sort((a, b) => b[0] - a[0]);
		tList.shift();
		this.setState({
			result: this.state.metadata[result],
			expected: '',
			confidence: confidence,
			confidenceList: tList
		});
	};

	argMax(array) {
		return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
	}

	render() {
		if (typeof this.state.model === 'string') {
			if (this.state.model === 'loading') {
				return (
					<div className="flex box">
						<Typography variant="h1">Loading model...</Typography>
					</div>
				);
			} else {
				return (
					<div style={{ height: '100%', padding: '0 auto', marginTop: '25vh' }}>
						<Typography style={{ textAlign: 'center' }} variant="h1">
							Loading model failed!
						</Typography>
						<br />
						<Typography style={{ textAlign: 'center' }}>
							The server at {serverAddress} responded with error code {xhr.status}
							<br />
							It should hopefully be back up at some point in the near future.
							{/* TODO add link back to main portion of website for this downed page */}
						</Typography>
					</div>
				);
			}
		}
		return (
			<React.Fragment>
				<div className="flex box">
					<DrawingCard
						size={this.state.padSize}
						model={this.state.model}
						renderToGrid={this.renderToGrid}
						renderedToGrid={this.renderedToGrid}
					/>
					{this.state.landscape && <DisplayCard size={this.state.padSize} grid={this.state.grid} />}
				</div>

				<Container>
					<div style={{ textAlign: 'center' }}>
						<Typography style={{ textAlign: 'center' }} variant="h4">
							Click and drag to draw. Space to clear.
						</Typography>
						<Typography variant="h2">
							{this.state.result !== undefined && `${this.state.result}`}
						</Typography>
						<Typography style={{ textAlign: 'center' }} variant="body1">
							{this.state.confidence > 0 && `${this.state.confidence}% confidence`}
						</Typography>
						<div>
							{this.state.confidenceList.map((val, idx) => (
								<React.Fragment key={idx}>
									<br />
									<Typography style={{ textAlign: 'center' }} variant="caption">
										{this.state.metadata[val[1]]} : {val[0]}%
									</Typography>
								</React.Fragment>
							))}
						</div>
					</div>
				</Container>
			</React.Fragment>
		);
	}
}

export default App;
