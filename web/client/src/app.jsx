import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import DisplayCard from './displayCard';
import DrawingCard from './drawingCard';
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import Header from './components/header';

var model;
var xhr;
var resizeListener;
var keydownListener;

const serverAddress = 'https://yacoubahmed.me/api/digit-classifier/';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			model: 'loading...',
			metadata: null,
			modelIndex: [],
			selectedModelType: 'loading',
			grid: [],
			padSize: 0
		};

		xhr = new XMLHttpRequest();
		var url = serverAddress + '/index';
		xhr.open('GET', url, true);
		xhr.send();

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var jsonData = JSON.parse(xhr.responseText);
				this.setState({ modelIndex: jsonData }, () => {
					const defaultType = Object.keys(this.state.modelIndex)[0];
					this.setState({ selectedModelType: defaultType });
				});
			} else {
				if (xhr.status === 0) {
					this.setState({ model: 'failed - the server appears to be down' });
				}
			}
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.selectedModelType !== prevState.selectedModelType) {
			console.log(`getting new model type ${this.state.selectedModelType}`);
			this.setState({ model: 'loading...' }, () => {
				model = tf.loadLayersModel(serverAddress + `/models/${this.state.selectedModelType}/model.json`);
				model
					.then(value => {
						this.setState({ model: value });
					})
					.catch(reason => {
						this.setState({ model: 'failed' });
						console.error(reason);
					});

				this.getMetadata(this.state.selectedModelType);
			});
		}
	}

	keyDownHandler = event => {
		if (event.keyCode === 'C'.charCodeAt(0)) {
			let newTList = [];
			for (let i = 0; i < Object.keys(this.state.metadata['dict']).length; i++) {
				newTList.push(0);
			}
			this.setState({ tList: newTList });
		}
	};

	componentDidMount() {
		this.resizeHandler();
		resizeListener = window.addEventListener('resize', this.resizeHandler);
		keydownListener = window.addEventListener('keydown', this.keyDownHandler);
		setTimeout(() => {
			this.resizeHandler();
		}, 1);

		setInterval(() => {
			this.resizeHandler();
		}, 1000);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', resizeListener);
		window.removeEventListener('keydown', keydownListener);
	}

	getMetadata = type => {
		xhr = new XMLHttpRequest();
		var url = serverAddress + `/models/${type}/metadata.json`;
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
		let padSize = 28 * 5;
		if (window.innerWidth < 370) {
			padSize = 28 * 8;
		} else if (window.innerWidth < 576) {
			padSize = 28 * 9;
		} else if (window.innerWidth < 768) {
			padSize = 28 * 7;
		} else {
			padSize = 28 * 9;
		}
		// } else if (window.innerWidth < 992) {
		// 	padSize = 28 * 9;
		// } else if (window.innerWidth < 1200) {
		// 	padSize = 28 * 9;
		// } else {
		// 	padSize = 28 * 9;
		// }
		if (this.state.padSize !== padSize) {
			this.setState({ padSize: padSize });
		}
	};

	renderToGrid = grid => {
		console.log('got new grid');
		this.setState({ grid: grid });
	};

	modelPredict = () => {
		if (typeof this.state.model === 'string') {
			setTimeout(() => {
				this.modelPredict();
			}, 100);
			return;
		}
		console.log('doing prediction');
		// we have to rotate the pixel grid since MNIST data is ordered differently
		let flippedGrid = [];
		for (let x = 0; x < this.state.grid.length; x++) {
			let col = [];
			for (let y = 0; y < this.state.grid[x].length; y++) {
				// insert pixels the other way round
				// we also insert pixels contained in a [array] to match the reshaping done during training
				col.push([this.state.grid[y][x]]);
			}
			flippedGrid.push(col);
		}
		console.log(flippedGrid);
		// let tensorGrid = tf.tensor3d([flippedGrid]);
		let tensorGrid = tf.tensor4d([flippedGrid]);
		const prediction = this.state.model.predict(tensorGrid);
		var tList = prediction.dataSync();
		tList = Array.prototype.slice.call(tList);
		tList = tList.map(val => Math.round(val * 1000.0) / 10.0);
		console.log(tList);
		if (this.state.selectedModelType === 'letters') {
			tList.shift();
		}
		this.setState({ tList: tList });
		// tList = tList.map((val, idx) => [this.state.metadata['dict'][idx], Math.round(val * 1000.0) / 10.0]);
		// tList = tList.filter((val, idx) => val[1] > 0);
		// tList.sort((a, b) => b[1] - a[1]);
		// console.log(tList);
	};

	render() {
		// TODO implement model failed screen
		if (this.state.metadata !== null) {
			console.log(Object.values(this.state.metadata['dict']));
		}
		return (
			<React.Fragment>
				<div className="container">
					<Header></Header>
					<div className="row" style={{ margin: '1em', textAlign: 'center' }}>
						<div className="col-sm">
							Model Type:{' '}
							<DropdownButton
								variant="success"
								id="dropdown-basic"
								title={this.state.selectedModelType}
								style={{ display: 'inline-block' }}
							>
								{Object.keys(this.state.modelIndex).map((val, idx, arr) => (
									<Dropdown.Item
										as="button"
										onClick={() => {
											console.log(`dropdown set to ${val}`);
											this.setState({ selectedModelType: val });
										}}
										eventKey={idx}
										key={idx}
									>
										{val}
									</Dropdown.Item>
								))}
							</DropdownButton>
						</div>
						<div className="col-sm">
							Model status: {typeof this.state.model === 'string' ? this.state.model : 'loaded'}
						</div>
					</div>
					{typeof this.state.model !== 'string' && (
						<div className="row" style={{ margin: '1em', textAlign: 'center' }}>
							<div className="col">{this.state.modelIndex[this.state.selectedModelType]}</div>
						</div>
					)}

					<div className="row" style={{ margin: '1em' }}>
						<div className="col-lg-1"> </div>
						<div className="col-sm" style={{ textAlign: 'center' }}>
							<DrawingCard
								size={this.state.padSize}
								model={this.state.model}
								renderToGrid={this.renderToGrid}
							/>
						</div>
						<div className="col-sm" style={{ textAlign: 'center' }}>
							<DisplayCard size={this.state.padSize} grid={this.state.grid} />
						</div>
						<div className="col-lg-1"> </div>
					</div>
					<div className="row">
						<div className="col"> </div>
						<div className="col" style={{ textAlign: 'center' }}>
							<Button
								onClick={() => {
									this.modelPredict();
								}}
							>
								Predict
							</Button>
						</div>
						<div className="col"> </div>
					</div>
					<div className="row">
						<div className="col"> </div>
						<div className="col" style={{ textAlign: 'center' }}>
							<sub>Press C to clear</sub>
						</div>
						<div className="col"> </div>
					</div>
					<div className="row" style={{ margin: '1em' }}>
						{this.state.metadata && (
							<Bar
								data={{
									labels: Object.values(this.state.metadata['dict']),
									datasets: [
										{
											label: 'Prediction',
											backgroundColor: 'rgb(255, 99, 132)',
											borderColor: 'rgb(255, 99, 132)',
											data: this.state.tList
										}
									]
								}}
								options={{
									scales: {
										yAxes: [
											{
												ticks: {
													beginAtZero: true,
													suggestedMax: 100
												}
											}
										]
									}
								}}
							></Bar>
						)}
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default App;
