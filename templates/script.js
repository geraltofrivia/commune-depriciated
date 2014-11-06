	function clean(element) {
		var textfield = document.getElementById(element)
		console.log(textfield.value)
		document.getElementById('result').innerHTML = textfield.value
		loadXMLDoc(textfield.value)
	}

	function loadXMLDoc(char) {
		var xmlhttp;
		xmlhttp=new XMLHttpRequest();
		var params = "val=" + char;
		xmlhttp.open("post","recv",true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
		xmlhttp.send(params);
	}
