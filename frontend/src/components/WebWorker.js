// WebWorker.js

// @args: You can pass your worker parameters on initialisation
export default function WebWorker(args) {
	let onmessage = e => { // eslint-disable-line no-unused-vars
//deleteme
console.log("Executing: ");
console.log(e.data);
		eval(e.data); // eslint-disable-line no-eval
		postMessage("Response");
	};
}