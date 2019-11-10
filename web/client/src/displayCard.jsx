import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import P5Wrapper from 'react-p5-wrapper';
import networkDisplay from './networkDisplay';

class DisplayCard extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<Card
				id="displayCard"
				className="displayCard"
				onClick={() => {
					document.getElementById('displayCard').classList.add('shake');
					setTimeout(() => {
						document.getElementById('displayCard').classList.remove('shake');
					}, 1000);
				}}
			>
				<div>
					What the network sees
					<P5Wrapper sketch={networkDisplay} size={this.props.size} grid={this.props.grid} />
				</div>
			</Card>
		);
	}
}

export default DisplayCard;
