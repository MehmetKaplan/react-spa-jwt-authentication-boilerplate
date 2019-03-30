// WebWorker.js

// @args: You can pass your worker parameters on initialisation
export default function WebWorker(args) {
	let onmessage = e => { // eslint-disable-line no-unused-vars
		 // Write your code here...
		 
		 postMessage("Response");
	};
}