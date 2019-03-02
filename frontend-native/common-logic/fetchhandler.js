export function fetch_add_params (p_params_as_json){
	var l_esc = encodeURIComponent;
	var l_retval = Object.keys(p_params_as_json)
		.map(k => l_esc(k) + '=' + l_esc(p_params_as_json[k]))
		.join('&');	
	return l_retval
}


export function fetch_data_v1(p_function_to_execute_with_result_json, p_uri, p_method, p_params_as_json, p_cross_or_same_origin, p_origin){
	if (['GET', 'POST', 'PUT'].indexOf(p_method.toUpperCase()) < 0) {
		throw Object.assign(new Error("Unknown method: " + p_method + ". Allowed are GET, POST, PUT."), { code: 400 });
	};
	if (['CROSS', 'SAME'].indexOf(p_cross_or_same_origin.toUpperCase()) < 0) {
		throw Object.assign(new Error("Unknown origin: " + p_cross_or_same_origin + ". Allowed are CROSS, SAME."), { code: 400 });
	};
	var l_uri = p_uri;
	var l_fd = new FormData();
	var l_Init = {};
	var l_Headers = new Headers();

	l_Headers.append("method", p_method.toUpperCase());
	l_Init.method = p_method.toUpperCase();
	if (p_method.toUpperCase() === "POST") {
		for (var l_key in p_params_as_json) {
			l_fd.append(l_key, p_params_as_json[l_key]);
		};
		l_Init.body = l_fd;
	}
	else {
		l_uri += "?" + fetch_add_params(p_params_as_json);
	};


	if (p_cross_or_same_origin.toUpperCase() === "CROSS") {
		l_Headers.append("Access-Control-Allow-Origin", "*");
		l_Headers.append("credentials", 'omit');
		l_Headers.append("mode", "cors");
	}
	else {
		l_Headers.append('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
	};
	l_Init.headers = l_Headers;
	l_Init.cache = 'default';

	fetch(l_uri, l_Init)
				.then(function(response) {
					return response.json();
				})
				.then(function(p_json) {
					p_function_to_execute_with_result_json(p_json);
				});
}

export function fetch_data_v2(
		p_method, 
		p_uri, 
		p_extra_headers, 
		p_body,
		p_fnc
	) {
	let l_uri = p_uri;
	let l_headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	for (var attrname in p_extra_headers) { l_headers[attrname] = p_extra_headers[attrname]; }
	let l_init = {
		method: p_method,
		headers: l_headers,
	}
	if (p_method === "POST") l_init.body = JSON.stringify(p_body);
	else l_uri += "?" + fetch_add_params(p_body);
	fetch(l_uri, l_init)
		.then((response) => response.json())
		.then((responseJson) => p_fnc(responseJson));
}

function deleteme(p_method, 
	p_uri, 
	p_extra_headers, 
	p_body,
	p_fnc)
{
	let l_uri = p_uri;
	let l_headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	for (var attrname in p_extra_headers) { l_headers[attrname] = p_extra_headers[attrname]; }
	let l_init = {};
	l_init.method = p_method;
	if (p_method === "POST") l_init.body = JSON.stringify(p_body);
	else l_uri += "?" + fetch_add_params(p_body);
	l_init.headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
	};

	fetch(l_uri, l_init)
	.catch((err) => {
		alert(err);
	});


}

export function fetch_data_v2_def(){
	let l_f = deleteme; //fetch_data_v2;
	let l_retval = {};
	l_retval.fdef = l_f.toString().replace(/(\r\n|\n|\r)/gm," ");
	l_retval.name = l_f.name;
	return l_retval;
}

//module.exports = fetch_data_generic;

