//constants


var imageGalleryWidth = 450;
var imageGalleryPadding = 40;
var splashImgDim = { "w" : 0 , "h" : 0};

var navShowing = false;



$(document).ready(function(){

	$.getJSON('results.json', function(data) {
			buildEvents(data);
		});

	$("#image-sequence-container").addClass("spinner");

	 $("#navContainer").slideDown();

	//setting height of body and pushing icons up

	var windowHeight = $(window).height();
	console.log(windowHeight);
	// $("#socialContainer").css("margin-top" ,  windowHeight );
	var tempHeight = -windowHeight + 230;
	console.log(tempHeight);
	// $("#socialContainer").css("top" ,  tempHeight );

	//putting together outside slide

	$("#socialContainer2").append($("#socialContainer").html());
	$("#socialContainer2 #itunes img").attr("src" , "elements/itunes_button2.png");

	//click handler

	$("#navContainer li").click(function(){

	var scrollCount = 0;
	goToByScroll($(this).attr('id'));

	});

	$("#home").click(function(){

	var scrollCount = 0;
	 $('html,body').animate({scrollTop: 0},'slow');

	});

	$("#picturesSection .arrow-button").click(function(){

		var dir = $(this).attr("class");
		var dir = dir.split(" ")[0];
		var distanceToMove = imageGalleryWidth + imageGalleryPadding;
		console.log(dir);

		if(dir == "right")
		{
			$("#slide-container").animate({left : "-=" + distanceToMove} , 700 , function(){

				var divToMove = $("#slide-container").find(".galleryImage").first();
				var moveNext = $("#slide-container").find(".galleryImage").last();
				moveNext.after( divToMove );
				$("#slide-container").css("left" , -distanceToMove);

			});
		}
		else if(dir == "left")
		{
			$("#slide-container").animate({left : "+=" + distanceToMove} , 700 , function(){

				var divToMove = $("#slide-container").find(".galleryImage").last();
				var moveNext = $("#slide-container").find(".galleryImage").first();
				moveNext.before( divToMove );
				$("#slide-container").css("left" , -distanceToMove);

			});
		}


		

	});

	$("#email1").click(function(){
		window.open("mailto:kiddosong@gmail.com?Subject=Hello%20Kiddo");
	});

	$("#email2").click(function(){
		window.open("mailto:contact@vazivamusic.com?Subject=Hello%20Kiddo");
	});

	//scroll handlers

	var navBar=0;

	$(window).scroll(function() {
		
			var curScroll = $(window).scrollTop();
			 var scrollOffset = $(window).height() ;
	
		  if( curScroll >scrollOffset+131 && navBar == 0)
		  {
		  	
		  	$("#navContainer2").addClass("active");
		  	$("#socialContainer2").css("visibility" , "visible");
		  	$("#socialContainer2").animate({left: 0},'fast');
		  	navBar = 1;
		  }
		  else if ( curScroll < 131 && navBar == 1)
		  {
		  	$("#navContainer2").removeClass("active");
		  	$("#socialContainer2").animate({left: -65},'fast');
		  	
		  	
		  	navBar = 0;
		  }
		  
		
		}); 

	$(window).resize(function(){

		// var newDim = resizeWithExcessCalc(splashImgDim.w , splashImgDim.h , 0);

		// console.log("new dim");
		// console.log(newDim);
		// $("#image-sequence-container").css({
		// 	"width" : newDim.w,
		// 	"height" : newDim.h,
		// 	"top" : newDim.t,
		// 	"left" : newDim.l
		// });

	});

	$("#splashPage").click(function(){
		if(animationFinished)
		{
			 $('html,body').animate({scrollTop: $(this).height()},'slow');
		 }
	});

	$(window).mousemove(function(e){

		if(animationFinished)
		{

			var middleOffset = $(window).width() * 0.1;

			var distFromCenter = Math.abs( e.pageX - ($(window).width()/2) );
			var perX;

			if(distFromCenter < middleOffset/2)
			{
				perX = 0;
			}
			else
			{
				perX = (distFromCenter - middleOffset/2) / (($(window).width()-middleOffset) / 2);
			}


			// var perX = distFromCenter / ($(window).width() / 2);

			// console.log(perX);

			var chosenFrame = Math.floor(imagesToLoad * perX);



			playFrame(chosenFrame);
		}
		

	

		// var chosenImg = imageArray[chosenFrame];




	});


	//setting up photo gallery
	initGallery();

	// loading image sequence
	// setTimeout(function(){ 
		loadImageSequence();
	// } , 1000);

	$(window).resize();


});

// <h3>NYC</h3>
// <p>

// February 17 </br>
// 9pm - <a href="http://www.pianosnyc.com/" target="_blank"> Pianos</a>
// </br></br>

var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

function buildEvents(data){
	var events = data.events;

	var container = $("<div>");
	var cityArray = [];

	for( var i = 0 ; i < events.length ; i++)
	{
		var ev = events[i];
		var cityExists = false;

		var city = unescape(ev.city);
		var cityClass = city.replace(/\s+/g, '');
		var date = new Date(unescape(ev.date));
		var time = unescape(ev.time);
		var venue = unescape(ev.venue);
		var link = unescape(ev.link);

		//specific date info
		var month = monthNames[date.getMonth()];
		var day = date.getDate() + 1;

		for( var j = 0 ; j < cityArray.length ; j++)
		{
			if( cityArray[j] == city)
				cityExists = true;
		}

		//building event obj
		var evEl = $("<p>" , {
			"class" : "event"
		});

		console.log(month, day);
		var eventString = month +" " + day + "<br/>" + time + "-" + "<a href='" + link +"' target='_blank'>" + venue + "</a><br/><br/>"; 

		evEl.html(eventString);

		//building city obj

		var cityEl;

		if(cityExists)
		{
			cityEl = $("#live-event-container").find("." + cityClass);

		}
		else
		{
			cityArray.push(city);

			cityEl = $("<div>" , {
				"class" : cityClass
			}).html("<h3>" + city + "</h3>").appendTo("#live-event-container");
		}

		evEl.appendTo(cityEl);



		console.log(events[i]);
	}
}

var imagesLoaded = 0;
var imagesToLoad = 42;
var imageArray = [];

var animationFinished = false;

function loadImageSequence(){

	var srcBase = "/images";
	var startNum = 1;

	for( var i = 0 ; i <  imagesToLoad ; i ++)
	{
		var tempImg = new Image;
		tempImg.onload = function(){
			imageArray[this.tag] = this;
			imageLoaded();
		}

		var correctedNum = imagesToLoad - (i+1);

		// console.log(correctedNum)

		var num = zeroPad(correctedNum+1 , 2);
		var url = "images/imageSequence/photo" + num +".jpg";
		tempImg.tag = i;
		tempImg.src = url;
	}
}


function imageLoaded(){
	imagesLoaded ++;

	if(imagesLoaded >= imagesToLoad)
	{
		splashImgDim.w = imageArray[0].width;
		splashImgDim.h = imageArray[0].height;

		$(window).resize();

		$("#image-sequence-container").removeClass("spinner");

		// console.log(splashImgDim);

		isPlaying = true;

		loop();		
	}	
}

var curFrame = 0;
var maxFrame = imagesToLoad;
var goingBackwards = false;
var isPlaying = false;
var frameRate = 60;

var delayFrame = false;

function loop(){
	

	changeFrame();
	var fr = frameRate;

	if(delayFrame)
	{
		delayFrame = false;
		fr = frameRate * 10;
	}

	setTimeout(function(){
		if(isPlaying)
		{
			loop();
		}
		
	} , fr);
}


function changeFrame(){

	if(curFrame >= maxFrame && !goingBackwards)
	{
		goingBackwards = true;
	}
	else if (curFrame <= 0 && goingBackwards)
	{
		isPlaying = false;

		animationFinished = true;
	}

	
	if( curFrame == maxFrame)
	{
		delayFrame = true;
	}



 	goingBackwards ? curFrame-- : curFrame++;

 	playFrame(curFrame);

 	// console.log(imageArray[curFrame]);

 	

	
}

function playFrame(i){
	 
	$("#image-sequence-container").html(imageArray[i]);
}

function zeroPad(num, size) 
{
   var s = "000000000000" + num;
   return s.substr(s.length-size);
}




//widgets
function initGallery(){

	// resizing images
	$("#picturesSection").find(".galleryImage").each(function(){

	});

	console.log($("#slide-container"));
	// putting last image first and move left
		var divToMove = $("#slide-container").find(".galleryImage").last();
		var moveNext = $("#slide-container").find(".galleryImage").first();
			moveNext.before( divToMove );
	$("#slide-container").css("left" , -(imageGalleryWidth + imageGalleryPadding));
	
}



//functions

function resizeWithExcessCalc(imgW , imgH , _excess){



     
	    var boundH = $(window).height();
	    var boundW = $(window).width();
      




		// var newWidth;
  //       var newHeight;
  //       var excess =  _excess ;
  //       var hExcess;
  //       var wExcess;

  //       //fitting image to smallest orientation
  //       var whRatio = imgW - imgH;

  //       if(whRatio > 0)
  //       {
  //           wExcess = excess;
  //           hExcess = imgH / imgW * excess;
  //           newHeight = boundH;
  //           newWidth = imgW / ( imgH / newHeight );

  //       }
  //       else
  //       {
  //           hExcess = excess;
  //           wExcess = imgW / imgH * excess;
  //           newWidth = boundW;
  //           newHeight = imgH / ( imgW / newWidth );
  //       }
        
  //       //scaling up if one orientation isnt contained

  //       var wRatio = newWidth / boundW;
  //       var hRatio = newHeight / boundH;

  //       var excessNeeded = 1;


  //       if(wRatio < 1){
  //           excessNeeded = wRatio;
  //       }
  //       if(hRatio < 1 ){
  //           excessNeeded = hRatio;
  //       }
        
  //       var returnHeight = newHeight / (excessNeeded) + hExcess;
  //       var returnWidth = newWidth / (excessNeeded) + wExcess;
  //       var returnLeft = (boundW - returnWidth ) /2;
  //       var returnTop = (boundH - returnHeight ) /2;
        
        return { "h" : returnHeight , "w":returnWidth , "l" : returnLeft , "t" : returnTop }

	}

function goToByScroll(id){

	  $('html,body').animate({scrollTop: $("#"+id+"Section").offset().top - 120},'slow');
}
	
