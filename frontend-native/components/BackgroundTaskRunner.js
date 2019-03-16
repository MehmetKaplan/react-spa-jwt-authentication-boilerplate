import * as React from 'react';
import { Text, View, StyleSheet, WebView } from 'react-native';

import {background_fetch_str} from '../common-logic/fetchhandler.js';

export default class BackgroundTaskRunner extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			webViewLoaded: false
		};
		this.handleMessage = this.handleMessage.bind(this);
	};

	injectjs() {
		let jsCode = background_fetch_str(this.props.method, this.props.uri, this.props.extra_header, this.props.body);
		return jsCode;
	}

	handleMessage = (e) => {
		//console.log('message from webview:', message);
		alert(`Message from webview: ${JSON.stringify(e.nativeEvent.data, null, " ")}`);
	}

	render() {
		//injectedJavaScript: lets you inject JavaScript code to be executed within the context of the WebView.
		//injectJavaScript: lets you inject JavaScript code that is executed immediately on the WebView, with no return value.
		return (
			<View style={styles.container}>
				<WebView
					ref={webview => { this.webview = webview; }}
					onLoad={() => {
						if ( this.state.webViewLoaded ) return;
						this.setState({ webViewLoaded: true });
					}}
					source={{
						//html: "<html><body>DEFAULT TEXT</body></html>"
						html: "DEFAULT TEXT2"
					}}
					injectedJavaScript={this.injectjs()}
					javaScriptEnabled={true}
					style={styles.webview}
					onMessage={this.state.webViewLoaded ? this.handleMessage : null}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F5F5',
	},
	webview: {
		flex: 1,
		alignSelf: 'stretch',
	},
});



