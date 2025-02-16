"use strict";

let endpoint01 = "https://misdemo.temple.edu/auth";
let endpoint02 = "http://mis3502-luong.com:8222";

let createTripController = function(){
	console.log("createTripController()");
	$('#createTrip_message').html('');
	$('#createTrip_message').removeClass();

	let usertoken = $("#usertoken").val(); 
	let startStation = $("#startStation").val();
	let endStation = $("#endStation").val();

	if (usertoken == "" || usertoken == undefined || isNaN(usertoken)){
		$('#createTrip_message').html('Error in usertoken input');
		$('#createTrip_message').addClass("alert alert-danger text-center");
		console.log("error name")
		return;
	} 

	if(startStation == endStation){
		$('#createTrip_message').html('Start and end stations cannot be the same.');
		$('#createTrip_message').addClass("alert alert-danger text-center");
		return;
	}
	if (startStation == "" || startStation == undefined){ 
		$('#createTrip_message').html('Start station must be selected.');
		$('#createTrip_message').addClass("alert alert-danger text-center");
		return;
	} 
	if (endStation == "" || endStation == undefined){
		$('#createTrip_message').html('End station must be selected.');
		$('#createTrip_message').addClass("alert alert-danger text-center");
		return;
	} 

	let the_serialized_data = "usertoken=" + usertoken + "&startStation=" + startStation + "&endStation=" + endStation;
	console.log(the_serialized_data);
	
	$.ajax({
		url : endpoint02 + "/trip",
		data : the_serialized_data,
		method : "POST",
		success : function(result){
			$(".content-wrapper").hide();
			$("#div-newTrip").show();

			if(startStation < endStation){
				console.log('Southbound');
				$('#tripDirection').html('Southbound')
			} else {
				console.log('Northbound');
				$('#tripDirection').html('Northbound')
			}
			
			let trip_id = result['insertId']
			tripsController(trip_id);
		},
		error:function(data){
			console.log(data)
		}
	})
}

let tripsController = function(trip_id){
	$("#trip_id").val(trip_id);
	let the_serialized_data = "trip_id=" + trip_id;

	$.ajax({
		url : endpoint02 + "/plan",
		data : the_serialized_data,
		method : "GET",
		success : function(result){
			console.log(result);

			for(let i=0; i < result.length; i++){
				let tripPlan = result[i]['stationName'];
					tripPlan = tripPlan + '<br>'
				$('#tripPlan').append(tripPlan);
			}
		},
		error : function(data){
			console.log(data);
		}
	})

}
let statusController = function(trip_id){
	$("#trip_id").val(trip_id);

	let the_serialized_data = "trip_id=" + trip_id; 
	$.ajax({
		url : endpoint02, 
		data : the_serialized_data,
		method : "GET",
		success : function(results){
			console.log(results);
			$("#tripDirection").html(results[0]['trip_id']); 	
			$("#tripPlan").html(results[0]['trip_id']);
			$("#stationid").html(results[0]['trip_id']);
		},
		error: function(data){
			console.log("Error")
			console.log(data)
		}
	});
	$(".content-wrapper").hide();
	$("#div-newTrip").show(); 
}

let loginController = function(){
	$('#login_message').html("");
	$('#login_message').removeClass();


	let username = $("#username").val();
	let password = $("#password").val();
	if (username == "" || password == ""){
		$('#login_message').html('The user name and password are both required.');
		$('#login_message').addClass("alert alert-danger text-center");
		return;
	}

	let the_serialized_data = $('#form-login').serialize();
	$.ajax({
		"url" : endpoint01,
		"method" : "GET",
		"data" : the_serialized_data,
		"success" : function(result){
			if (typeof result === 'string'){
				localStorage.removeItem("usertoken");
				$('#login_message').html("Login Failed. Try again.");
				$('#login_message').addClass("alert alert-danger text-center");
			} else {
				localStorage.usertoken = result['user_id']; 
				$('#login_message').html('');
				$('#login_message').removeClass();
				$('.secured').removeClass('locked');
				$('.secured').addClass('unlocked');
				$('#div-login').hide(); //hide the login page
				$('#div-trip').show();   
				$('#usertoken').val(result['user_id']);
			}			
		},
		"error" : function(data){
			console.log("Something went wrong");
			console.log(data);
		},
	}); //end of ajax 

	//scroll to top of page
	$("html, body").animate({ scrollTop: "0px" });
};


$(document).ready(function (){

    /* ----------------- start up navigation -----------------*/	
    /* controls what gets revealed when the page is ready     */

    /* this reveals the default page */
	if (localStorage.usertoken){
		$("#div-trip").show()
		$(".secured").removeClass("locked");		
		$(".secured").addClass("unlocked");
		$('#usertoken').val(localStorage.usertoken); // ***M added so each refresh contains usertoken
	}
	else {
		$("#div-login").show();
		$(".secured").removeClass("unlocked");
		$(".secured").addClass("locked");
	}

    /* ------------------  basic navigation -----------------*/	
    /* this controls navigation - show / hide pages as needed */

	/* links on the menu */
		
	/* what happens if the link-trip anchor tag is clicked? */
	$('#link-trip').click(function(){
		$(".content-wrapper").hide(); 	/* hide all content-wrappers */
		$("#div-trip").show(); /* show the chosen content wrapper */
	});
		
	/* what happens if the link-history anchor tag is clicked? */
	$('#link-history').click(function(){
		$(".content-wrapper").hide(); 	
		$("#div-history").show(); 
	});

	/* what happens if any of the navigation links are clicked? */
	$('.nav-link').click(function(){
		$("html, body").animate({ scrollTop: "0px" }); /* scroll to top of page */
		$(".navbar-collapse").collapse('hide'); /* explicitly collapse the navigation menu */
	});

	/* what happens if the login button is clicked? */
	$('#btnLogin').click(function(){
		loginController();
	});

	$("#btntrip").click(function(){
		//console.log("Create trip")
		createTripController();
	});

	$("#btnEditTrip").click(function(){
		$(".content-wrapper").hide(); 	
		$("#div-trip").show(); 
	})
	

	/* what happens if the logout link is clicked? */
	$('#link-logout').click(function(){
		// First ... remove usertoken from localstorage
		localStorage.removeItem("usertoken");
		// Now force the page to refresh
		window.location = "./index.html";
	});

}); /* end the document ready event*/