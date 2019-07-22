import React, { Component } from 'react';
import { Card } from '@material-ui/core';
import P5Wrapper from 'react-p5-wrapper';
import networkDisplay from './networkDisplay';

class DisplayCard extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<Card className="displayCard">
				<div>
					What the network sees
					<div style={{ width: '308px', height: '308px' }}>
						<P5Wrapper
							sketch={networkDisplay}
							grid={this.props.grid}
							renderedToGrid={this.props.renderedToGrid}
						/>
					</div>
				</div>
			</Card>
		);
	}
}

export default DisplayCard;
