export default function networkDisplay(p) {
	const gridSize = 28;
	let propsGrid = [];

	p.setup = function() {
		p.createCanvas(28 * 5, 28 * 5);
		p.background(0);
		// p.noLoop();
	};

	let drawBackground = false;

	p.draw = function() {
		if (drawBackground) {
			p.background(0);
			drawBackground = false;
		}
	};

	p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
		if (p.width !== props.size) {
			p.resizeCanvas(props.size, props.size);
			drawBackground = true;
		}

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
	};
}
