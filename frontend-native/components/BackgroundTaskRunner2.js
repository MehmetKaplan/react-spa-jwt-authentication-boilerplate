import * as React from 'react';
import { Text, View, StyleSheet, WebView } from 'react-native';
// import { Constants } from 'expo';

// You can import from local files
// import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
// import { Card } from 'react-native-paper';

export default class BackgroundTaskRunner2 extends React.Component {

  injectjs() {
    let jsCode = `const bodyData = JSON.stringify({
      title: 'foo',
      body: 'bar',
      userId: 1
	 });
    fetch('http://172.20.10.12:8000/test', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: bodyData,
		})
		.then(response => {
alert("Step 1");
			return response.text()
		})
		.then(valueText => {
			alert(JSON.stringify(valueText));
	 })
	 .catch((err) => {
		 alert(err);
		});
alert("I am here");	 
		`;
    return jsCode;
  }
  
  render() {
    return (
      <View style={styles.container}>
       <WebView
          ref={webview => { this.webview = webview; }}
					source={{
            uri: "https://www.google.com"
            }}
            injectedJavaScript={this.injectjs()}
            javaScriptEnabled = {true}
            style={styles.webview}
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
    flex:1,
    alignSelf: 'stretch',
},
});