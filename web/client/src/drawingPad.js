export default function drawingPad(p) {
	let lastX = -1;
	let lastY = -1;
	let gotLast = false;
	var renderFunc;
	var thickness = 20;

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

		renderFunc = props.renderToGrid;
	};

	p.mousePressed = function() {
		p.noStroke();
		p.fill(255);
		p.ellipse(p.mouseX, p.mouseY, thickness, thickness);
	};

	p.mouseDragged = function() {
		if (!gotLast) {
			lastX = p.mouseX;
			lastY = p.mouseY;
			gotLast = true;
		}
		p.stroke(255);
		p.strokeWeight(thickness);
		p.line(lastX, lastY, p.mouseX, p.mouseY);
		lastX = p.mouseX;
		lastY = p.mouseY;
	};

	p.keyPressed = function() {
		if (p.keyCode === 'C'.charCodeAt(0)) {
			p.background(0);
			p.renderToGrid(false);
		}
	};

	p.mouseReleased = function() {
		p.renderToGrid(true);
		gotLast = false;
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
				col.push(avg / 255);
			}
			grid.push(col);
		}

		checkModelDone(grid);
	};

	function checkModelDone(grid) {
		renderFunc(grid);
	}
}
