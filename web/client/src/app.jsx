import React, { Component } from 'react';
import { Typography, Container } from '@material-ui/core';
import * as tf from '@tensorflow/tfjs';
import DisplayCard from './displayCard';
import DrawingCard from './drawingCard';

var model;
var xhr;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			model: 'loading',
			grid: [],
			shouldPredict: false,
			result: undefined,
			confidence: 0,
			confidenceList: [],
			expected: '',
			padSize: 308,
			metadata: {}
		};

		model = tf.loadLayersModel('http://localhost:3003/model');
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

	getMetadata = () => {
		xhr = new XMLHttpRequest();
		var url = 'http://localhost:3003/metadata';
		xhr.open('GET', url, true);
		xhr.send();

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var jsonData = JSON.parse(xhr.responseText);
				this.setState({ metadata: jsonData });
				console.log(jsonData);
			}
		};
	};

	renderToGrid = (grid, shouldPredict) => {
		this.setState({ grid: grid, shouldPredict: shouldPredict });
	};

	renderedToGrid = () => {
		console.log('render done');
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
		return (
			<React.Fragment>
				<div style={{ width: '100%', height: `calc(${this.state.padSize}px + 8em)` }}>
					<div
						style={{ width: `calc(${2 * this.state.padSize}px + 24em)`, height: '100%', margin: '0 auto' }}
					>
						<DrawingCard
							style={{ width: `${this.state.padSize}px`, marginRight: '2em' }}
							size={this.state.padSize}
							renderToGrid={this.renderToGrid}
							model={this.state.model}
						/>
						<DisplayCard
							style={{ width: `${this.state.padSize}px`, marginLeft: '2em' }}
							size={this.state.padSize}
							grid={this.state.grid}
							renderedToGrid={this.renderedToGrid}
						/>
					</div>
				</div>
				<Container>
					<div style={{ textAlign: 'center' }}>
						<Typography style={{ textAlign: 'center' }} variant="h2">
							Start drawing!
							<br />
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
