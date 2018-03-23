$(document).ready(function(){

    // SET UP DATABASE

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAH-hvLtOxs_aYXPObKGewPTtNFvZ9yCK8",
        authDomain: "beerrewards-bc381.firebaseapp.com",
        databaseURL: "https://beerrewards-bc381.firebaseio.com",
        projectId: "beerrewards-bc381",
        storageBucket: "beerrewards-bc381.appspot.com",
        messagingSenderId: "958252999049"
    };

    firebase.initializeApp(config);

    // Assign reference to database to var 'database'
    var database = firebase.database();
    var ref;

    // Hide all components of results panel
    $('#beer-results').hide();
    $('#change-beer-preference').hide();

    // USER INFO
    // Get user info on 'Submit'
    $("#find-beer").on("click", function(event) {
        event.preventDefault();

        ref = database.ref('users');

        // Go ahead as long as inputs are validated
        if(getInputValues()){

            // Capture weight input
            var weight = $('#weight').val().trim();
            $('#weight').val('');
            console.log('Weight: ' + weight);

            // Capture MET number from exercise input
            var workoutMetValue = $('#workout').val();
            $('#workout').val('');
            console.log('MET: ' + workoutMetValue);

            // var workoutActivity = $('#workout option:selected').text(); // <-- Not working?
            // console.log('Workout activity: ' + workoutActivity);

            // Capture length of workout
            var workoutLength = $('#activity-length').val().trim();
            $('#activity-length').val('');
            console.log('Workout: ' + workoutLength + 'hrs');

            // Create object components for user
            data = {
                weight: weight,
                MET: workoutMetValue,
                workoutLength: workoutLength
            }

            // Add user data to database
            ref.push(data).then( function (result) {
                console.log("Generated key: " + result.key);
            });

            // Capture beer preference
            var beerPreference = $('#beer-search').val().trim();
            $('#beer-search').val('');
            console.log('Beer preference: ' + beerPreference);

            // Call function to calculte calories burned
            calories(workoutMetValue, weight, workoutLength);

            // Run this if beerPreference has input
            if (beerPreference !== '') {

                // Call function to search for beer
                searchBreweryDb(beerPreference);

                // Scroll results into view, alter scroll distance based on screen size
                function mediaSize() {
                    var isTabletLandscape = window.matchMedia('(min-width: 992px) and (max-width: 1366px) and (orientation: landscape)');
                    var isPhoneLandscape = window.matchMedia('(min-width: 320px) and (max-width: 991px) and (orientation: landscape)');
                    var isPhonePortrait = window.matchMedia('(min-width: 320px) and (max-width: 812px) and (orientation: portrait)');
                    if (isTabletLandscape.matches) {
                        $('html,body').animate({scrollTop: $("#beer-results").offset().top + 600
                    }, 1000)
                    } else if (isPhoneLandscape.matches) {
                        $('html,body').animate({scrollTop: $("#beer-results").offset().top + 1400
                    }, 1000)
                    } else if (isPhonePortrait.matches) {
                        $('html,body').animate({scrollTop: $("#beer-results").offset().top + 1400
                    }, 1000)
                    } else {
                        $('html,body').animate({scrollTop: $("#beer-results").offset().top + 600
                    }, 1000)
                    }
                }
                mediaSize();
            }

        // Run the modal if user doesn't fill out all required fields
        } else {
            $("#myModal").modal();
        }
    });




    // CALORIES BURNED
    // Calculate calories burned using MET
    // MET values from https://epi.grants.cancer.gov/atus-met/met.php
    var caloriesBurned = 0;

    function calories(MET, lbWeight, workoutLength) {

        // Turn weight into kg
        var kgWeight = lbWeight/2.2;

        // Calculate calories burned
        caloriesBurned = MET * kgWeight * workoutLength;
        console.log('Calories burned: ' + caloriesBurned);
    }



    // BREWERY DB
    // Global variables
    var beerLogo; // <-- Not working properly ***
    var beerName;
    var beerStyle;
    var abv;
    var beerCompany;
    var breweryLocality;
    var breweryRegion;
    var breweryLocation;
    var beerDescription;
    var count = 0;

    // Div to hold beer item for list results
    var beerListItemDiv = $('<div class="beer-list-item">');

    // Search for beer
    function searchBreweryDb(beerPreference) {

        // AJAX call to get beer info
        var myURL = "http://api.brewerydb.com/v2/search/?key=2d763c46c3991fbfd625ffaea69e88f6&q=" + beerPreference + "&withBreweries=Y";
        $.ajax( {
            url: 'https://corsbridge.herokuapp.com/' + encodeURIComponent(myURL),
            method: "GET"
        }).then(function (response) {

            console.log(response);
            // console.log(response.data.length);

            // If response DNE for search
            if(!response.hasOwnProperty('data')){

                // Show error message in html element
                $('#beer-preference').html('No Beer Results for \'' + beerPreference + '\'');
                return false;
            }

            // Empty last results and reset results counter
            $('#beer-table > tbody').empty();
            counter = 0;

            // Search up to 30 beers
            for (var i=0; i<30; i++) {

                // beerLogo = $('<img>').attr("src", response.data[i].labels.medium);

                // Stop search when 12 beers meet criteria
                if (counter === 12) {
                    break;
                }

                // Get name of beer
                beerName = response.data[i].nameDisplay;
                console.log('Beer name: ' + beerName);
                // if (beerName == undefined) {
                //     $('#beer-preference').html('No Beer Results for \'' + beerPreference + '\'');
                // }

                // Get style of beer
                if (response.data[i].style !== undefined) {
                    beerStyle = response.data[i].style.name;
                    console.log('Beer style: ' + beerStyle);
                }

                // Get abv of beer
                abv = response.data[i].abv;
                console.log('ABV: ' + abv);

                // Get brewery location
                breweryLocality = response.data[i].breweries[0].locations[0].locality;
                breweryRegion = response.data[i].breweries[0].locations[0].region;
                breweryLocation = ' in ' + breweryLocality + ', ' + breweryRegion;
                console.log('Location: ' + breweryLocation);

                // Get brewery name
                beerCompany = response.data[i].breweries[0].name;
                console.log(beerCompany);

                // Parameters for displaying brewery name location
                // Don't display 'undefined' if brewery name or location is undefined
                if ( (beerCompany == undefined) && (breweryLocality == undefined) && (breweryRegion == undefined) ) {
                    beerCompany = '';
                    breweryLocation = '';
                }
                // Only display brewery name if location is undefined
                else if ( (breweryLocality == undefined) && (breweryRegion == undefined) ){
                    beerCompany = 'Brewed by ' + beerCompany;
                }
                // Display brewery name and region if locality is undefined
                else if ( (breweryLocality == undefined) && (breweryRegion !== undefined) ){
                    beerCompany = 'Brewed by ' + beerCompany + ' in ' + breweryRegion;
                }
                // Display brewery name and region if locality is undefined
                else if ( (breweryLocality !== undefined) && (breweryRegion == undefined) ){
                    beerCompany = 'Brewed by ' + beerCompany + ' in ' + breweryLocality;
                }
                // Display all 3 if all available
                else {
                    beerCompany = 'Brewed by ' + beerCompany + breweryLocation;
                }

                // Get beer description
                beerDescription = response.data[i].description;
                console.log('Beer description: ' + beerDescription);

                // Call function to estimate calories in 12oz beer
                estimateCalories(abv);

                // Hide instructions
                $('#beer-results').show();

                // Display search term in display panel title
                $('#beer-preference').html('Beer Results for \'' + beerPreference + '\'');

                // $('#workout-display').text('Workout: ' + workoutLength + ' hours');

                $('#change-beer-preference').show();

            }
        })
    };



    // CALCULATE CALORIES/12 OZ
    var caloriesEstPer12oz;

    // Estimate calories per 12 oz beer
    function estimateCalories(abv) {

        caloriesEstPer12oz = parseInt(abv) * 2.5 * 12;
        console.log('Calories estimate per 12oz: ' + caloriesEstPer12oz);

        // Call function to calculate beers earned
        estimateWorkoutWorth(caloriesBurned, caloriesEstPer12oz);
    }



    // # OF BEERS EARNED
    var amountBeersAllowed;

    // Estimate amount of beer type allowed
    function estimateWorkoutWorth(caloriesBurned, caloriesEstPer12oz) {

        amountBeersAllowed = caloriesBurned/caloriesEstPer12oz;

        // Round number to 1 decimal
        if (amountBeersAllowed == NaN) {
            amountBeersAllowed = '';
        }
        else {
            amountBeersAllowed = Math.round( amountBeersAllowed * 10 ) / 10;
        }
        console.log('Amount of beers allowed: ' + amountBeersAllowed);

        // Call function to display beer results
        displayResults();
    }



    // ADD TO RESULTS
    function displayResults() {

        // Only include in results if name, abv, description, and style available
        if ( (beerName !== undefined) && (abv !== undefined) && (beerDescription !== undefined) && (beerStyle !== undefined)) {

            // Add 1 to results counter
            counter++;
            console.log('Counter: ' + counter);

            // Add results to new row
            var row = $('<tr>')
                // Append image here
                //   .append(
                //       '<td>' + 
                //           beerLogo +
                //       '<td>'
                //   )

                .append(
                    '<td>' + 
                        '<p id="beer-titles"><strong><span id="beer-results-name">' + beerName + '</span></strong>' + ' ' + beerStyle + ', ' + abv + ' ABV' + '<br></p>' +
                        '<p id="brewery"><i>' + beerCompany + '</i></p><br>' +
                        '<span id="description">' + beerDescription + '</span><br>' + 
                        '<p id="worth">Workout worth (12oz): <span id="amount">' + amountBeersAllowed + '</span></p><br>' +
                    '</td>');

            // Add new row to table
            $('#beer-table > tbody').prepend(row);
        }
    }



    // CHANGE BEER PREFERENCE
    // When submit button clicked
    $("#change-beer").on("click", function(event) {
        event.preventDefault();

        // Get text input and clear textbox
        var beerPreference = $('#beer-search-change').val().trim();
        $('#beer-search-change').val('');
        console.log('Change preference to: ' + beerPreference);

        // If form is not blank, call function to search for beers
        if (beerPreference !== '') {
            searchBreweryDb(beerPreference);
        }

    })



    // PUNK API
    function getRandomBeer() {

        // AJAX call to get random beer
        var queryURL = "https://api.punkapi.com/v2/beers/random";
        $.ajax( {
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            console.log(response);

            // Create div to hold beer
            var randomBeerDiv = $('<div class="random-beer">');

            // Get logo, name, and description
            var logo = response[0].image_url;

            var beerName = response[0].name;
            console.log(beerName);

            var beerDescription = response[0].description;
            console.log(beerDescription);

            // Add info to div
            randomBeerDiv.append(
                '<img class=center height=200px src="' + logo + '">' + '<br>' + 
                '<p id=beer-name data-toggle=tooltip title="' + beerDescription + '">' + beerName + '</p>'
            );

            // Add div to 'Discover beer' display
            $('#random-beer').html(randomBeerDiv);

            // Add description to beer name on hover
            $('#beer-name').tooltip();

            // Display new beer evey 10 seconds
            window.setTimeout(getRandomBeer, 10000);
        })
    }

    getRandomBeer();



    // FORM VALIDATION
    // Prevent user from leaving inputs empty
    // #weight, #activity-length, #beer-search
    function getInputValues() {

        weight = $('#weight').val().trim();
        workoutLength = $('#activity-length').val().trim();
        beerPreference = $('#beer-search').val().trim();

        // Tests if 'Weight' input exists.
        if(weight === "") {
            //alert("Please enter your weight");
            $("#weight").val("").focus();
            return false;

        // Tests if 'Workout Length' exists.
        } else if (workoutLength === "") {
            //alert("Please enter the time of your workout");
            $("#activity-length").val("").focus();
            return false;

        // Tests if 'Beer Preference' exists.
        } else if (beerPreference === "") {
            //alert("Please enter a beer preference");
            $("#beer-search").val("").focus();
            return false;
            
        // If all fields are complete, go ahead.
        } else {
            return true;
        }
    }// End of getInputValues()
})