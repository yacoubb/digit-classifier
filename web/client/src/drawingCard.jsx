import React, { Component } from 'react';
import { Card } from '@material-ui/core';
import P5Wrapper from 'react-p5-wrapper';
import drawingPad from './drawingPad';

class DrawingCard extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<Card className="displayCard">
				<div>
					Draw Here
					<div style={{ width: '308px', height: '308px' }}>
						<P5Wrapper
							sketch={drawingPad}
							renderToGrid={this.props.renderToGrid}
							model={this.props.model}
						/>
					</div>
				</div>
			</Card>
		);
	}
}

export default DrawingCard;
