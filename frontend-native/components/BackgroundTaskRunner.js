import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class BackgroundTaskRunner extends Component {

	constructor(props){
		super(props);
		this.state = {
			html: "<html><body>Nothing here</body></html>"
		};

	};

	componentDidMount(){
		this.runJSInBackground(this.props.code);
	}

	render() {
 		return (
			 <WebView
					ref={el => this.webView = el}
					source={{
						 html: this.state.html,
//						 uri: 'http' + '://172.20.10.12:8000/test',
					  }}
					  originWhitelist={['*']}
					/>

		/*
			<WebView
				ref={el => this.webView = el}
				source={{html: '<html><body></body></html>'}}
				onMessage={this.handleMessage}
			/>
		*/
		)
	}
	runJSInBackground (code) {
		// To check the code that is to be executed from backend
		//console.log(code);
		//this.webView.injectJavaScript(code)
		this.webView.injectJavaScript(`
				var l_headers = "";
				var l_init = {
				};
				fetch("http" + "://172.20.10.12:8000/test").then(response => response.html())
				.then(text => {
					this.setState({ html: text });
				})
				.catch((err) => {
					alert(err);
				});
			`);
	}
	handleMessage = (e) => {
		const message = e.nativeEvent.data;
		console.log('message from webview:', message);
		alert(message);
	}
}


