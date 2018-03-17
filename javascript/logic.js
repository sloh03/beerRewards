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
  

  
    // USER INFO
    // Get user info on 'Submit'
    $("#find-beer").on("click", function(event) {
      event.preventDefault();

      // Create object components for user
      user = {
        weight: 0,
        MET: 0,
        workoutLength: 0,
      }

      // Add user to database
      database.ref().child("user").set(user);
  
      // Capture weight input
      var weight = $('#weight').val().trim();
      $('#weight').val('');
      console.log('Weight: ' + weight);
      database.ref().child('user/weight').set(weight);
  
      // Capture MET number from exercise input
      var workoutMetValue = $('#workout').val();
      $('#workout').val('');
      console.log('MET: ' + workoutMetValue);
      database.ref().child('user/MET').set(workoutMetValue);
  
      // Capture length of workout
      var workoutLength = $('#activity-length').val().trim();
      $('#activity-length').val('');
      console.log('Workout: ' + workoutLength + 'hrs');
      database.ref().child('user/workoutLength').set(workoutLength);
  
      // Capture beer preference
      var beerPreference = $('#beer-search').val().trim();
      $('#beer-search').val('');
      console.log('Beer preference: ' + beerPreference);
  
      calories(workoutMetValue, weight);

      if (beerPreference !== '') {
        searchBreweryDb(beerPreference);
      }
  
    });
  
  
  
  
    // CALCULATE CALORIES
    // Calculate calories burned using MET
    // MET values from https://epi.grants.cancer.gov/atus-met/met.php
    var caloriesBurned = 0;
  
    function calories(MET, lbWeight) {
  
        var kgWeight = lbWeight/2.2;
        caloriesBurned = MET * kgWeight;
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
  
    // AJAX call to get beer info
      function searchBreweryDb(beerPreference) {
  
          var myURL = "http://api.brewerydb.com/v2/search/?key=2d763c46c3991fbfd625ffaea69e88f6&q=" + beerPreference + "&withBreweries=Y";
          $.ajax( {
              url: 'https://corsbridge.herokuapp.com/' + encodeURIComponent(myURL),
              method: "GET"
          }).then(function (response) {
  
              console.log(response);
  
              for (var i=0; i<12; i++) {

                //   beerLogo = $('<img>').attr("src", response.data[i].labels.medium);
  
                  beerName = response.data[i].nameDisplay;
                  console.log('Beer name: ' + beerName);
                  if (beerName == undefined) {
                    $('#beer-table > tbody').text("No results found for " + beerPreference);
                  }
  
                  beerStyle = response.data[i].style.name;
                  console.log('Beer style: ' + beerStyle);
  
                  abv = response.data[i].abv;
                  console.log('ABV: ' + abv);

                  beerCompany = response.data[i].breweries[0].name;
                  console.log(beerCompany);
                  if (beerCompany == undefined) {
                      beerCompany = '';
                  }
                  else {
                    beerCompany = 'Brewed by ' + beerCompany;
                  }

                  breweryLocality = response.data[i].breweries[0].locations[0].locality;
                  breweryRegion = response.data[i].breweries[0].locations[0].region;
                  breweryLocation = breweryLocality + ', ' + breweryRegion;
                  console.log('Location: ' + breweryLocation);
  
                  beerDescription = response.data[i].description;
                  console.log('Beer description: ' + beerDescription);

                  estimateCalories(abv);
  
                  // Hide instructions
                  $('#start-message').hide();

                  $('#beer-preference').html('Beer Results for \'' + beerPreference + '\'');
  
              }
          })
      };
  
  
  
      // CALORIES/12 OZ
      var caloriesEstPer12oz;
  
      // Estimate calories per 12 oz beer
      function estimateCalories(abv) {
          caloriesEstPer12oz = parseInt(abv) * 2.5 * 12;
          console.log('Calories estimate per 12oz: ' + caloriesEstPer12oz);
  
          estimateWorkoutWorth(caloriesBurned, caloriesEstPer12oz);
      }
  
  
  
      // # OF BEERS ALLOWED
      var amountBeersAllowed;
      // Estimate amount of beer type allowed
      function estimateWorkoutWorth(caloriesBurned, caloriesEstPer12oz) {
          amountBeersAllowed = caloriesBurned/caloriesEstPer12oz;
          if (amountBeersAllowed == NaN) {
              amountBeersAllowed = '';
          }
          else {
             amountBeersAllowed = Math.round( amountBeersAllowed * 10 ) / 10;
          }
          console.log('Amount of beers allowed: ' + amountBeersAllowed);
  
          displayResults();
      }
  
  

      // ADD TO RESULTS
      function displayResults() {
  
        if ( (abv !== undefined) && (beerDescription !== undefined) ) {
          var row = $('<tr>')
              // Append image here
            //   .append(
            //       '<td>' + 
            //           beerLogo +
            //       '<td>'
            //   )

              .append(
                  '<td>' + 
                      '<p id="beer-titles"><strong>' + beerName + '</strong>' + ', ' + beerStyle + ', ' + abv + ' ABV' + '<br></p>' +
                      '<i>' + beerCompany + '</i><br>' +
                      beerDescription + '<br>' + 
                      '<p>Workout worth: ' + amountBeersAllowed + '</p>' +
                  '</td>');
      
          $('#beer-table > tbody').append(row);

        }

      }



    // PUNK API
    function getRandomBeer() {
  
        var queryURL = "https://api.punkapi.com/v2/beers/random";
        $.ajax( {
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            console.log(response);

            var randomBeerDiv = $('<div class="random-beer">');

            var logo = response[0].image_url;

            var beerName = response[0].name;
            console.log(beerName);

            randomBeerDiv.append(
                '<img class=center height=200px src="' + logo + '">' + '<br>' + 
                '<p id=beer-name>' + beerName + '</p>'
            );

            $('#random-beer').append(randomBeerDiv);
            
        })

    }

    getRandomBeer();
})