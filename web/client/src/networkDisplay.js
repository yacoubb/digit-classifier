export default function networkDisplay(p) {
	const gridSize = 28;

	p.setup = function() {
		p.createCanvas(308, 308, p.WEBGL);
		p.background(0);
	};

	p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
		console.log(props.grid);
		if (props.grid.length === 0) {
			return;
		}
		p.translate(-p.width / 2, -p.height / 2);
		const pixelsInGrid = p.width / gridSize;
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				p.fill(props.grid[x][y]);
				p.rect(x * pixelsInGrid, y * pixelsInGrid, pixelsInGrid, pixelsInGrid);
			}
		}
	};

	p.draw = function() {};
}
