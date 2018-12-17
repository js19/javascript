var  map;
var m = new Array();
window.onload = function(){
	 createMap();
	 createStyle();
	 map.on('move',removeMarkers);
}

//This function was added because the stylesheet was not working on javascript created elements, so I copied the style to 
//this function.
function createStyle(){
	var x = document.createElement("STYLE");
	 var t = document.createTextNode("div#photos {max-width: 400px;max-height: 200px;overflow-y: auto;}");
	 var j = document.createTextNode("div#photos img {float:left; width: 75px;height: 75px;margin: 5px;border: 1px solid #666;}");
	 var side = document.createTextNode("h3:hover {color:#00c;}");
	 x.appendChild(t);
	 x.appendChild(j);
	 x.appendChild(side);
	 document.head.appendChild(x);
}

function removeMarkers(){
	
	for(var i = 0; i < m.length; i++){
		map.removeLayer(m[i]);
	}
	
	if(document.getElementById('sidebar') != null){
		document.getElementById("sidebar").remove();
		document.getElementById("places").innerHTML = '<h2>ARTICLES<h2>';
		makeRequest(map);
	}
	
}

function getRad(mapBounds, distance){
	return 6371 * Math.cos(Math.sin(mapBounds.lng) * Math.sin(mapBounds.lat)
		+Math.cos(mapBounds.lng) * Math.cos(mapBounds.lat) * Math.cos(mapBounds.lat - mapBounds.lng));
}

function makeRequest(map){
	var xhr = new XMLHttpRequest();
	console.log("xhr");
	var mapBounds = map.getBounds().getNorthEast();
	console.log("bounds");
	var distance = mapBounds.distanceTo(map.getCenter());
	console.log("getCenter");
	var radius = getRad(mapBounds, distance);
	var lng = map.getCenter().lng;
	console.log(radius+500);
	var lat = map.getCenter().lat;
	xhr.onload = function(){
		dropPoints(xhr, map);
	}
	var link = 'server/wiki.php?lat='+lat+'&long='+lng+'&rad='+radius;
	xhr.open('GET', link, true);
	xhr.send(null);
}


function dropPoints(xhr, map){
	responseObject = JSON.parse(xhr.responseText);
	var newContent = '';	
	if(responseObject.continue){
	for(var i = 0; i < Object.values(responseObject.query.pages).length;i++){
		newContent += '<div id="sidebar">';
		newContent += '<h3 onclick="show('+i+')">'+Object.values(responseObject.query.pages)[i].title+'</h3>';
		var extract = Object.values(responseObject.query.pages)[i].extract;
		if(extract != null){
			newContent += '<div id="hide"><p>' +Object.values(responseObject.query.pages)[i].extract+'</p>';
		}else{
			newContent += '<div id="hide"><p></p>';
		}
		newContent += '<a href="'+Object.values(responseObject.query.pages)[i].fullurl+'target="_blank">Read on Wikipedia</a></div>'; 
		newContent += '</div>';
		marker = L.marker([Object.values(responseObject.query.pages)[i].coordinates[0].lat,Object.values(responseObject.query.pages)[i].coordinates[0].lon]).addTo(map);
		m.push(marker);
		map.addLayer(m[i]);
		if(Object.values(responseObject.query.pages)[i].thumbnail === undefined){
			marker.bindPopup('<div id="photos"><a href="'+Object.values(responseObject.query.pages)[i].fullurl + '">'+ Object.values(responseObject.query.pages)[i].title +'</a></div>');
		}else{
			marker.bindPopup('<div id="photos"><a href="'+Object.values(responseObject.query.pages)[i].fullurl + '">'+Object.values(responseObject.query.pages)[i].title+'</a>'+
				'<img src="'+Object.values(responseObject.query.pages)[i].thumbnail.source+'"></div>');
		}
	}
	document.getElementById('places').innerHTML += newContent;
	collapse();
}
}
function show(index){
	collapse(index);
	if(document.getElementById('places').getElementsByTagName('p')[index] != undefined){
		document.getElementById('places').getElementsByTagName('p')[index].style.display ='block';
	}
	document.getElementById('places').getElementsByTagName('a')[index].style.display ='block';
}

function collapse(x = null){
	var side = document.getElementById('places').getElementsByTagName('p').length;
	for(var i = 0; i < side; i++){
		if(i != x){
			if(document.getElementById('places').getElementsByTagName('p') != undefined){
				document.getElementById('places').getElementsByTagName('p')[i].style.display ='none';
			}
		document.getElementById('places').getElementsByTagName('a')[i].style.display ='none';
		}
	}
}

function createMap(){
	document.getElementById("map").innerHTML = "<div id='mapid'></div>";
	map = L.map('mapid');
	map.setView([39.2858, -76.6131],17);
	
	L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
        {
        attribution: '©OpenStreetMap, ©CartoDB'
        }).addTo(map);
	makeRequest(map);
}