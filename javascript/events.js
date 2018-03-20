
$(document).ready(function(){

    function autoDisplayEvents() {

        var eventType1 = $("#workout-event").val();

        var queryURL = "http://api.eventful.com/json/events/search?app_key=J5kvbtGnvrsF2MwM&keywords=" + eventType1 + "&location=tucson&date=Future";

        $.ajax({
            url: 'https://corsbridge.herokuapp.com/' + encodeURIComponent(queryURL),
            method: "GET",
            dataType: 'json'
        }).then(function (response) {

            console.log(response);

            var eventful = response.events.event;

            for (var i = 0; i < 10; i++) {

                eventTitle = eventful[i].title;
                //console.log("Title: " + eventful[i].title);

                eventVenue = eventful[i].venue_address;
                //console.log("Venue: " + eventful[i].venue_address);

                startTime = eventful[i].start_time;
                //console.log("Starts: " + eventful[i].start_time);

                eventDateString = moment(startTime).format('ddd, MMM Do, h:mm a');
                //console.log("Moment start time: " + eventDateString);

                eventLink = eventful[i].url;
                //console.log("Link: " + eventLink);

                displayEvents();
            }
        });
    }

    autoDisplayEvents();

    // AJAX call to get event info.
    $("#find-event").on("click", function(event) {
        event.preventDefault();
        // Clear the previous event listings if they exist.
        $('#event-table > tbody').empty();

        var eventType1 = $("#workout-event").val();
        var eventLocation = $("#workout-location").val().trim();

        var queryURL = "http://api.eventful.com/json/events/search?app_key=J5kvbtGnvrsF2MwM&keywords=" + eventType1 + "&location=" + eventLocation + "&date=Future";

        $.ajax({
            url: 'https://corsbridge.herokuapp.com/' + encodeURIComponent(queryURL),
            method: "GET",
            dataType: 'json'
        }).then(function (response) {

            console.log("Response: " + response);

            if(response.events === null){
                // Show error message in html element
                $('#event-table > tbody').html("<strong>" + 'No Event Results for \'' + eventLocation + '\'' + "</strong>");
                return false;
            }

            var eventful = response.events.event;

            for (var i = 0; i < 10; i++) {

                eventTitle = eventful[i].title;
                //console.log("Title: " + eventful[i].title);

                eventVenue = eventful[i].venue_address;
                //console.log("Venue: " + eventful[i].venue_address);

                startTime = eventful[i].start_time;
                //console.log("Starts: " + eventful[i].start_time);

                eventDateString = moment(startTime).format('ddd, MMM Do, h:mm a');
                //console.log("Moment start time: " + eventDateString);

                eventLink = eventful[i].url;
                //var eventLink = $("<a>").attr("href", eventful[i].url).append(eventTitle);
                //console.log("Link: " + eventLink);

                displayEvents();
            }
        });
    })

    //ADD TO RESULTS
    function displayEvents() {

        if ( (eventTitle !== undefined) && (eventVenue !== undefined)) {

            // var row = $('<tr>').append('<td>' + '<span id="event-titles"><strong>' + '<a href="' + eventLink + '" target="_blank">' + eventTitle + '</a></strong></span>' + '<br>' + eventVenue + '<br>' + eventDateString + '<br>' + '</td>');
            var row = $('<tr>').append('<td>' + '<span id="event-titles"><strong>' + '<a href="' + eventLink + '" target="_blank">' + eventTitle + '</a>' + '</strong></span>' + '<br>' + eventVenue + '<br>' + eventDateString + '<br>' + '</td>');
            $('#event-table > tbody').append(row);
        }
    }
})