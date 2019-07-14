import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import drawingPad from './drawingPad';
import networkDisplay from './networkDisplay';
import { Card } from '@material-ui/core';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { grid: [] };
	}

	renderToGrid = grid => {
		console.log(grid);
		this.setState({ grid: grid });
	};

	render() {
		return (
			<React.Fragment>
				<div style={{ margin: '5em auto 0 auto', width: '816px' }}>
					<div
						style={{
							float: 'left',
							marginRight: '100px'
						}}
					>
						Draw Here
						<div style={{ width: '308px', height: '308px' }}>
							<P5Wrapper sketch={drawingPad} renderToGrid={this.renderToGrid} />
						</div>
					</div>
					<div
						style={{
							float: 'left',
							marginLeft: '100px'
						}}
					>
						What the network sees
						<div style={{ width: '308px', height: '308px' }}>
							<P5Wrapper sketch={networkDisplay} grid={this.state.grid} />
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default App;
