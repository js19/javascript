var sendButton;
var clearButton;
var d;

window.onload = function(){
	init();
}

function init(){
	
	sendButton = document.getElementsByClassName("btn btn-large btn-primary");
	clearButton = document.getElementsByClassName("btn btn-large");
	sendButton[0].setAttribute("type","button");

	clearButton[0].addEventListener('click', clear);
	sendButton[0].addEventListener("click", submit);

	startXhr();

	if(localStorage.getItem("name") != null){
		document.getElementById("name").value = localStorage.getItem("name");
	}

	setInterval(function(){ 
    	startXhr();
    }, 15000);

}

function startXhr(){
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if(xhr.status == 200){
			write(xhr);			
		}
	}

	xhr.open('GET', 'server/shout.php', true);
	xhr.send(null);

}

function write(xhr){
	responseObject = JSON.parse(xhr.responseText);
			var content = '';

			for(var i = responseObject.data.length - 1; i >= 0 ; i--){
				content += '<div class="shout">';
				content += '<span class="timestamp">[' + responseObject.data[i].time +']</span>';
				content += '<span class="name">' + responseObject.data[i].name + '</span>:';
				content += '<span style="message">' + responseObject.data[i].message + '</span>';
				content += '</div>';
			}

			document.getElementById("messages").innerHTML = content;
			document.getElementById("messages").scrollTop = 9999999;
}

function postXhr(name, message){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'server/shout.php', true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
    	if(xhr.readyState == 4 && xhr.status == 200) {
        	//console.log(xhr.responseText);
        	write(xhr);
    	}
	};
	xhr.send("name="+name+"&message=" + encodeURIComponent(message));
	startXhr();
}

function clear(){

	var message = document.getElementById("message");
	message.value = '';
	message.focus();

}

function submit(){
	var message = document.getElementById("message");
	var name = document.getElementById("name");
	var content = '';

	if(message.value.length > 0 && name.value.length > 0){
		if(message.value.trim().length != 0 || document.getElementById("name").value.trim().length != 0){
			localStorage.setItem("name", name.value);
			postXhr(name.value, message.value);
			clear();
		}else{
			alert("Message or name can not be empty!");
		}
	}else{
		alert("Please enter name and message!");
	}
	return false;
}

