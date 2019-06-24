import React, { Component } from 'react';
import { Platform, View } from 'react-native';

import { WebView } from 'react-native-webview'; 

import { background_fetch_str } from '../common-logic/fetchhandler.js';

export default class BackgroundTaskRunner extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			webViewLoaded: false
		};
	};
	handleMessage = (e) => {
		alert(`Message from webview: ${JSON.stringify(e.nativeEvent.data, null, " ")}`);
	}
	htmlSource() {
		let l_postMessageText = (Platform.OS === 'ios')
			? `window.ReactNativeWebView.postMessage(JSON.stringify(responseJson));\n\n`
			: `document.ReactNativeWebView.postMessage(JSON.stringify(responseJson));\n\n`;
		let l_injectJS = background_fetch_str(this.props.method, this.props.uri, this.props.extra_header, this.props.body).replace("postMessage(JSON.stringify(responseJson));", l_postMessageText);
		return `
			<html>
				<head></head>
				<body>
				<script>
						${l_injectJS}
				</script>
				</body>
			</html>`;
	}
	
	render() {
		const html = this.htmlSource();
		return (
			<View style={{ flex: 1 }}>
				<WebView
					source={{ html }}
					onMessage={(e) => this.handleMessage(e)}
				/>
			</View>
		);
	}
}