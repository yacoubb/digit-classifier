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
					<P5Wrapper
						sketch={drawingPad}
						size={this.props.size}
						model={this.props.model}
						renderToGrid={this.props.renderToGrid}
						renderedToGrid={this.props.renderedToGrid}
					/>
				</div>
			</Card>
		);
	}
}

export default DrawingCard;
