<?php
$password = "";
$password = $_GET["password"]

?>


<html>
<head>
	<title> template </title>

	<!-- libraries -->
	<script src="http://code.jquery.com/jquery-latest.js"></script>

	<script>

	// open existing json 

	var password = "<?= $password ?>" ;

	console.log(password);

	var savedEvents = {};

	

	$(document).ready(function(){

		$("#container").hide();
		$("#new-city").hide();

		if(password != "biboune")
		{
			var name=prompt("enter super secret password");
			if (name == "biboune" || password == "biboune")
			{
				initAdmin();  
				password = name;
			}
			else
			{
				alert("NO IDIOT!");
			}
		}
		else
		{
			initAdmin();
		}

		

		

		

	});

	function initAdmin(){

		$("#container").show();
		$.getJSON('../results.json', function(data) {
			savedEvents = data;

			showEvents();
		});

		$("#test").click(function(){
			// window.location = window.location.pathname + "?password=" + password;
			createEvent();
			
		});
	}

	function showEvents(){

		var events = savedEvents.events;
		var cityArray = [];

		for( var i = 0 ; i <  events.length ; i++)
		{
			var ev = events[i];
			var container = $("<div>" , {
				"class" : "event"
			});

			var button = $("<div>" , {
				"tag" : i,
				"class" : "event-button"
			}).appendTo(container);

			button.click(function(){
				deleteEvent($(this).parents(".event").index());
			});

			var eventInfo = unescape(ev.city) +" " + unescape(ev.date) +" "+ unescape(ev.time) +" "+unescape(ev.venue)+" "+unescape(ev.link);

			$("<div>").html(eventInfo).appendTo(container);

			container.appendTo("#event-container");

			//creating city array

			var curCity = unescape(ev.city);
			var cityExists = false;
			for( var j = 0 ; j < cityArray.length ; j++)
			{
				if(cityArray[j] == curCity)
				{
					cityExists = true;
					break;
				}
			}

			if(!cityExists)
			{
				cityArray.push(curCity);
			}

			//add city

			$("#add-city").click(function(){
				$("#city-dropdown").hide();
				$(this).hide();
				$("#new-city").show();
			});

		}


		//building dropdown

		var dropDown = $("<select>" , {
			"class" : "dropdown"
		});

		for( var i = 0 ; i <  cityArray.length ; i++)
		{
			var option = $("<option>" , {
				"value" : cityArray[i]
			}).html(cityArray[i]).appendTo(dropDown);

		}

		dropDown.appendTo("#city-dropdown");

		dropDown.change(function(){

			$("#new-city").val( $(this).val() );
			// console.log($(this).val());
		});

		dropDown.change();
	}

	function createEvent(){


			var obj = {};
			var isComplete = true;;

			$("#event-input input").each(function(){

				var tag = $(this).attr("tag");
				var data = $(this).val();
				
				if(data == "" && tag!="link")
				{
					alert("please enter all the event information before submitting");
					isComplete = false;
					return false;
				}
				else
				{
					obj[tag] = escape(data);
					console.log(obj[tag]);
				}
			});

			if(isComplete)
			{
				submitEvent(obj);
			}	

	}

	function deleteEvent(index){

		console.log(index);

		var events = savedEvents["events"];
		var newArray = [];

		for( var i = 0 ; i <events.length ; i++ )
		{
			if( i != index)
			{
				newArray.push(events[i]);
			}
		}

		saveEvents(newArray);
	}

	function submitEvent(obj){

		var eventArray = []

		if(savedEvents.events !== undefined)
		{
			eventArray = savedEvents["events"];
		}
		
		var newArray = [];
		var hasPushed = false;

		//new event
		if(obj)
			var newDate = new Date(obj.date);

		if(eventArray!=null)
		{
				for( var i = 0 ; i < eventArray.length ; i++)
			{
				var curEvent = eventArray[i];
				var curDate = new Date(curEvent.date);

				if(newDate < curDate && obj && !hasPushed)
				{
					newArray.push(obj);
					hasPushed = true;
				}

				newArray.push(curEvent);

			}	

		}
		
		if(!hasPushed && obj)
		{
			newArray.push(obj);
		}

		saveEvents(newArray);



		

	}

	function saveEvents(obj){


		var obj = { myData : obj};

		$.post("createEvent.php", obj , function(data){
				window.location = window.location.pathname + "?password=" + password;
			});
	}


	</script>

	<style>

		#event-input input{
			display: block;
		}

		.event {
		background-color: grey;
		margin: 10px;
		color: white;
		}

		.event-button {
		width: 20px;
		height: 20px;
		background-color: red;
		}

		#test {
		background-color: red;
		display: inline-block;
		padding: 10px;
		color: white;
		}

	</style>
	

	
</head>

<body>




	<div id="container">

		<h1> existing events </h1>
		<div id="event-container"></div>

		
		<h1> add an event </h1>
		<div id="event-input">
			place(city)
			<div id="city-dropdown"></div>
			<button id="add-city"> add city </button>
			</br>
			<input id="new-city" tag="city" type="text"/> 
			date
			<input tag="date" type="date"/>
			time 
			<input tag="time" type="text"/> 
			venue
			<input tag="venue" type="text"/>
			link
			<input tag="link" type="text"/>
		</div>

		<button id="test"> CREATE </button>
	
	</div>



</body>
</html>