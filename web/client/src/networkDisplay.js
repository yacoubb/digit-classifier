export default function networkDisplay(p) {
	const gridSize = 28;
	let propsGrid = [];

	p.setup = function() {
		p.createCanvas(308, 308);
		p.background(0);
		p.noLoop();
	};

	p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
		if (props.grid.length === 0) {
			return;
		}
		let propsEqual = props.grid.length === propsGrid.length;

		if (propsEqual) {
			doubleLoop: for (let x = 0; x < props.grid.length; x++) {
				for (let y = 0; y < props.grid[x].length; y++) {
					if (propsGrid[x][y] < props.grid[x][y] - 0.001 || propsGrid[x][y] > props.grid[x][y] + 0.001) {
						propsEqual = false;
						break doubleLoop;
					}
				}
			}
		}

		if (propsEqual) {
			return;
		}

		propsGrid = [];
		for (let x = 0; x < props.grid.length; x++) {
			propsGrid.push(props.grid[x].slice());
		}

		const pixelsInGrid = p.width / gridSize;
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				p.fill(propsGrid[x][y] * 255);
				p.rect(x * pixelsInGrid, y * pixelsInGrid, pixelsInGrid, pixelsInGrid);
			}
		}
		props.renderedToGrid();
	};
}
