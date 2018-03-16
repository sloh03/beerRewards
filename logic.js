$(document).ready(function(){

    // SET UP DATABASE
  
    // Initialize Firebase
    // var config = {
    // };
    // firebase.initializeApp(config);
  
    // Assign reference to database to var 'database'
    // var database = firebase.database();
  
    // });
  
  
  
    // USER INFO
    // Get user info on 'Submit'
    $("#find-beer").on("click", function(event) {
      event.preventDefault();
  
      // Capture weight input
      var weight = $('#weight').val().trim();
      $('#weight').val('');
      console.log('Weight: ' + weight);
  
      // Capture MET number from exercise input
      var workoutMetValue = $('#workout').val();
      $('#workout').val('');
      console.log('MET: ' + workoutMetValue);
  
      // Capture length of workout
      var workoutLength = $('#activity-length').val().trim();
      $('#activity-length').val('');
      console.log('Workout: ' + workoutLength + 'hrs');
  
      // Capture beer preference
      var beerPreference = $('#beer-search').val().trim();
      $('#beer-search').val('');
      console.log('Beer preference: ' + beerPreference);
  
      calories(workoutMetValue, weight);
      searchBreweryDb(beerPreference);
  
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
    var beerCompanyInfo; // <-- Need to add withBreweries to search url to get this in JSON ***
    var abv;
    var beerDescription;
  
    // Div to hold beer item for list results
    var beerListItemDiv = $('<div class="beer-list-item">');
  
    // AJAX call to get beer info
      function searchBreweryDb(beerPreference) {
  
          var queryURL = "https://corsbridge.herokuapp.com/http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Fsearch%2F%3Fkey%3D2d763c46c3991fbfd625ffaea69e88f6%26p%3D1%26q%3D*" + beerPreference + "*";
  
          $.ajax( {
              url: queryURL,
              method: "GET"
          }).then(function (response) {
  
              console.log(response);
  
              for (var i=0; i<12; i++) {
  
                  beerName = response.data[i].nameDisplay;
                  console.log('Beer name: ' + beerName);
  
                  beerStyle = response.data[i].style.name;
                  console.log('Beer style: ' + beerStyle);
  
                  abv = response.data[i].abv;
                  abv = abv + ' ABV';
                  console.log('ABV: ' + abv);
  
                  beerDescription = response.data[i].description;
                  console.log('Beer description: ' + beerDescription);
  
                  estimateCalories(abv);
  
                  // Hide instructions
                  $('#start-message').hide();
  
                  // // Display on results page
                  $('#beer-display').append(beerListItemDiv);
  
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
      // Estimate amount of beer type allowed
      function estimateWorkoutWorth(caloriesBurned, caloriesEstPer12oz) {
          var amountBeersAllowed = caloriesBurned/caloriesEstPer12oz;
          console.log('Amount of beers allowed: ' + amountBeersAllowed);
  
          displayResults();
      }
  
  
      // *** NEW ***
      // ADD TO RESULTS
      function displayResults() {
  
          var row = $('<tr>')
              // Append image here
              .append(
                  '<td>' + 
                      '<strong>' + beerName + '</strong>' + ', ' + beerStyle + ', ' + abv + '<br>' +
                      beerDescription + '<br>' + '<br>' +
                  '</td>');
      
          $('#beer-table > tbody').append(row);
      }
      
})