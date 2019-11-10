import React, { Component } from 'react';

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			navExpanded: false
		};
	}

	clickedDropdown = () => {
		this.setState({ navExpanded: !this.state.navExpanded });
		console.log('clicked');
	};

	render() {
		return (
			<>
				{/* <head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<link
						rel="stylesheet"
						href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
						integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
						crossOrigin="anonymous"
					/>
				</head> */}
				<nav className="navbar navbar-expand-lg navbar-light" style={{ textAlign: 'left' }}>
					<a className="navbar-brand" href="https://yacoubahmed.me">
						Yacoub Ahmed
					</a>
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
						onClick={this.clickedDropdown}
					>
						<span className="navbar-toggler-icon" />
					</button>

					<div
						className={`collapse navbar-collapse ${this.state.navExpanded ? 'show' : ''}`}
						id="navbarSupportedContent"
					>
						<ul className="navbar-nav mr-auto">
							<li className="nav-item">
								<a className="nav-link" href="https://yacoubahmed.me/blog">
									Blog
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="https://yacoubahmed.me/projects">
									Projects
								</a>
							</li>
							<li>
								<a className="nav-link" href="https://yacoubahmed.me/art">
									Art
								</a>
							</li>
							<li>
								<a className="nav-link" href="https://yacoubahmed.me/tech">
									Tech
								</a>
							</li>
						</ul>
						{/* <ul className="navbar-nav">
							<li>
								<a href="mailto:yacoub.ahmedy@gmail.com">
									<button className={`btn my-2`} style={{ marginRight: '1em' }}>
										Contact
									</button>
								</a>
							</li>
							<li>
								<a href="/login">
									<button className={`btn my-2`}>Login</button>
								</a>
							</li>
						</ul> */}
					</div>
				</nav>
			</>
		);
	}
}

export default Header;
