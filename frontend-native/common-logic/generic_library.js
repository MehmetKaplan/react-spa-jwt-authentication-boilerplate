export function compare_by_intid (a,b) {
	if (parseInt(a.id) < parseInt(b.id))
		return -1;
	if (parseInt(a.id) > parseInt(b.id))
		return 1;
	return 0;
}

export function sort_arrayofhash (p_input){
	return p_input.sort(compare_by_intid);
} 


/*
	Usage Example:

	sort_arrayofhash_byfield(g_GlobalData.data.contacts, "name", (a) => {return a});

*/

export function sort_arrayofhash_byfield (p_input_as_array, p_field_name_as_string, p_get_compare_value_as_function){
	return p_input_as_array.sort(
		function (p_left, p_right){
			var l_left_value = p_get_compare_value_as_function(p_left[p_field_name_as_string]);
			var l_right_value = p_get_compare_value_as_function(p_right[p_field_name_as_string]);
			if (l_left_value < l_right_value)
				return -1;
			if (l_left_value > l_right_value)
				return 1;
			return 0;
		}
	);
}


/*
	Usage Example:
	USE FOR STRING!!!
	g_GlobalData.data.contacts.sort(dynamicSortMultiple("surname","name"));
	l_arrayofhashes.sort(dynamicSortMultiple("surname","name"));
	l_arrayofhashes.sort(dynamicSortMultiple("surname","-name")); // Descending name
*/

export function dynamicSort (property) {
		var sortOrder = 1;
		if(property[0] === "-") {
				sortOrder = -1;
				property = property.substr(1);
		}
		return function (a,b) {
				var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
				return result * sortOrder;
		}
}

export function dynamicSortMultiple () {
		/*
		* save the arguments object as it will be overwritten
		* note that arguments object is an array-like object
		* consisting of the names of the properties to sort by
		*/
		var props = arguments;
		return function (obj1, obj2) {
				var i = 0, result = 0, numberOfProperties = props.length;
				/* try getting a different result from 0 (equal)
				* as long as we have extra properties to compare
				*/
				while(result === 0 && i < numberOfProperties) {
						result = dynamicSort(props[i])(obj1, obj2);
						i++;
				}
				return result;
		}
}

/*
	Usage Example:
	// l_conditions paramter holds the where condition, should be modified dynamically
	l_conditions = "(parseInt(p_cur_item.id) >= 100 && parseInt(p_cur_item.id) < '110') || (p_cur_item.surname == 'Kaplan' && p_cur_item.name == 'Kemal') ";
	filter_by_where(g_GlobalData.data.contacts), l_conditions);
*/


export function filter_by_where (p_array_of_hashes, p_conditions_as_string){
	var l_conditions_as_string = p_conditions_as_string;
	function filter_by_where_condition (p_cur_item) {
		/* eslint-disable no-eval */
		return eval (l_conditions_as_string);
		/* eslint-enable no-eval */
	}
	return p_array_of_hashes.filter(filter_by_where_condition);	
}


/*
	Usage Example:
	// l_conditions paramter holds the where condition, should be modified dynamically
	l_v1 = null;
	nvl(l_v1, "value replaced");
	l_v1 = 5;
	nvl(l_v1, "value replaced");
*/
export function nvl (value1,value2) 
{
	/* eslint-disable eqeqeq */
	if (typeof value1 == 'undefined') return value2;
	if (value1 == null) return value2;
	if (value1 === 0) return 0; // 0 is failing below check so it is explicitly defined here
	if (value1 == "") return value2;
	return value1;
	/* eslint-enable eqeqeq */
}

/*
	Usage: fibonacci(4) gives 4th element of Fibonacci sequence.
*/
export function fibonacci (num){
	var a = 1, b = 0, temp;
	while (num >= 0){
		temp = a;
		a = a + b;
		b = temp;
		num--;
	}
	return b;
}


/*
	Usage: l_arr = shuffle(l_arr);
*/
export function shuffle (array) { //DevSkim: ignore DS148264 
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/*
	Usage: if (checkVisible(l_elm)){do somnething};
*/
export function checkVisible (elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

/*
	Usage example:
		a = 
		[
			{
				post_id: 1,
				post_header: "Header Meader",
				post_content: "Deneme 123213 http://mit.edu falan filan http://stanford.edu"
			},
			{
				post_id: 2,
				post_header: "Header Meader",
				post_content: "Deneme 123213 http://mit.edu falan filan http://stanford.edu"
			},
		];

		b = 
		[
			{
				post_id: 1,
				post_header: "Header Meader Zeader",
				post_content: "Deneme 123213 http://mit.edu falan filan http://stanford.edu"
			},
			{
				post_id: 3,
				post_header: "Header Meader",
				post_content: "Deneme 123213 http://mit.edu falan filan http://stanford.edu"
			},
		];
		mergeTwoArraysOfHash(a, b, "post_id");
*/

export function mergeTwoArraysOfHash (p_recessive_arr, p_dominant_arr, p_columnname){
	var l_temp_arr = p_recessive_arr.filter((l_cur_hash) => {
		let l_conditions = "(p_cur_item." + p_columnname + " == '" + l_cur_hash[p_columnname] + "')";
		return !filter_by_where(p_dominant_arr, l_conditions).length;
    });
	return l_temp_arr.concat(p_dominant_arr);
}

/*
	Usage Sample:
	l_test_arr = 
	[
		{
			post_id: 1,
			post_content: "Hey I am the first hash with id 1"
		},
		{
			post_id: 2,
			post_content: "This is item 2"
		},
		{
			post_id: 1,
			post_content: "And I am the second hash with id 1"
		},
		{
			post_id: 3,
			post_content: "This is item 3"
		},
	];

	removeFromArrayOfHash(l_test_arr, "post_id", 2); // gives both of the post_id 1 hashes and the post_id 3
	removeFromArrayOfHash(l_test_arr, "post_id", 1); // gives only post_id 2 and 3
*/
export function removeFromArrayOfHash (p_array_of_hash, p_key, p_value_to_remove){
    return p_array_of_hash.filter((l_cur_row) => {return l_cur_row[p_key] !== p_value_to_remove});
}

/*
	Usage Sample:
	l_test_arr = 
	[
		{
			post_id: 1,
			post_content: "Hey I am the first hash with id 1"
		},
		{
			post_id: 2,
			post_content: "This is item 2"
		},
		{
			post_id: 4,
			post_content: "And I am the second hash with id 1"
		},
		{
			post_id: 3,
			post_content: "This is item 3"
		},
	];
	getIndex(l_test_arr, "post_id", 4); // returns 2
 */
export function getIndex (p_arr, p_hash_key, p_value) {
    for(var i = 0; i < p_arr.length; i++) {
        if(p_arr[i][p_hash_key] === p_value) {
            return i;
        }
    }
    return -1; //to handle the case where the value doesn't exist
}

export function getIndex_2 (p_arr, p_value) {
    for(var i = 0; i < p_arr.length; i++) {
        if(p_arr[i] === p_value) {
            return i;
        }
    }
    return -1; //to handle the case where the value doesn't exist
}

// Equivalent to Ruby's Time.now.utc.strftime("%Y%m%d%H%M%S%3N")
export function getUTCTimeAsString (){
    var now = new Date(); 
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 
        now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), 
        now.getUTCMilliseconds());
    /* eslint-disable no-useless-escape */
    return now_utc.toISOString().replace(/T|Z|\-|\:|\./g, '');
    /* eslint-enable no-useless-escape */
}

export function str_to_date(p_instr){
	// expected input format: 1976-12-23
	let p_instr_arr = p_instr.split("-");
	return new Date(
			parseInt(p_instr_arr[0]), 
			parseInt(p_instr_arr[1])-1, // javascript starts indexing months from 0. wierd. :-)
			parseInt(p_instr_arr[2])
	);
}


//date_to_str(new Date('Sun May 11,2014'), 'dd.MM.yyyy hh:mm:ss')
//date_to_str(new Date('Sun May 11,2014'), 'yyyy-MM-dd')
export function date_to_str(p_indate, p_format) {
    /* eslint-disable no-unused-vars */
    /* eslint-disable no-eval */
    var z = {
        M: p_indate.getMonth() + 1,
        d: p_indate.getDate(),
        h: p_indate.getHours(),
        m: p_indate.getMinutes(),
        s: p_indate.getSeconds()
    };
    p_format = p_format.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
    });
    /* eslint-enable no-eval */
    /* eslint-enable no-unused-vars */

    return p_format.replace(/(y+)/g, function(v) {
        return p_indate.getFullYear().toString().slice(-v.length)
    });
}

//module.exports = nvl;
