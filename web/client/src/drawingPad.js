export default function drawingPad(p) {
	var renderFunc;
	p.setup = function() {
		p.createCanvas(308, 308, p.WEBGL);
		p.background(0);
	};

	p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
		renderFunc = props.renderToGrid;
	};

	p.draw = function() {
		p.fill(255);
		p.noStroke();
		p.translate(-p.width / 2, -p.height / 2);
		if (p.mouseIsPressed) {
			p.ellipse(p.mouseX, p.mouseY, 50, 50);
		}
	};

	p.keyPressed = function() {
		if (p.keyCode === 32) {
			p.background(54);
			p.renderToGrid();
		}
	};

	p.mouseReleased = function() {
		p.renderToGrid();
	};

	p.renderToGrid = function() {
		console.log('rendering');
		p.loadPixels();
		let d = p.pixelDensity();
		let grid = [];
		const gridSize = 28;
		const pixelsInGrid = p.width / gridSize;
		for (let x = 0; x < gridSize; x++) {
			let col = [];
			for (let y = 0; y < gridSize; y++) {
				let avg = 0;
				let count = 0;
				for (let i = x * pixelsInGrid; i < (x + 1) * pixelsInGrid; i++) {
					for (let j = y * pixelsInGrid; j < (y + 1) * pixelsInGrid; j++) {
						count += 1;
						let pixelCoord = 4 * (j * d * p.width * d + i * d);
						let pixelBrightness = 0;
						for (let k = 0; k < 3; k++) {
							pixelBrightness += p.pixels[pixelCoord + k];
						}
						avg += pixelBrightness / 3;
					}
				}
				avg = avg / count;
				col.unshift(avg);
			}
			grid.push(col);
		}
		renderFunc(grid);
	};
}
