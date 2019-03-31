import * as React from 'react';

import {background_fetch_str} from '../common-logic/fetchhandler.js';

import WebWorkerEnabler from './WebWorkerEnabler.js';
// Your web worker
import WebWorker from './WebWorker.js';

// Worker initialisation
const workerInstance = new WebWorkerEnabler(WebWorker);


export default class BackgroundTaskRunner extends React.Component {

	constructor(props){
		super(props);
		this.state = {
		};
	};

	injectjs() {
		let jsCode = background_fetch_str(this.props.method, this.props.uri, this.props.extra_header, this.props.body);
		return jsCode;
	}

	componentDidMount(){
		workerInstance.addEventListener("message", e => {
//deleteme			
console.log("Received response:");
console.log(e.data);
		}, false);
		workerInstance.postMessage(this.injectjs());
	}

	render() {
		//injectedJavaScript: lets you inject JavaScript code to be executed within the context of the WebView.
		//injectJavaScript: lets you inject JavaScript code that is executed immediately on the WebView, with no return value.
		return (
				<React.Fragment>
					{"DEFAULT TEXT"}
				</React.Fragment>
		);
	}
}


