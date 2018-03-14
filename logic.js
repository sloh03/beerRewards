$(document).ready(function(){

  // SET UP DATABASE

  // Initialize Firebase
  // var config = {
  // };
  // firebase.initializeApp(config);

  // Assign reference to database to var 'database'
  // var database = firebase.database();

  // });

  // Calculate calories burned using MET
  // MET values from https://epi.grants.cancer.gov/atus-met/met.php
  var lbWeight = 0;
  var caloriesBurned = 0;

  var bikingMET = 8;
  var hikingMET = 6;
  var runningMET = 7.5;
  var walkingMET = 3.8;
  var yogaMET = 3;

  function calories(MET, lbWeight) {

      kgWeight = lbWeight/2.2;
      caloriesBurned = MET * kgWeight;
      console.log(caloriesBurned);
  }

  calories(8, 120);

  var keyword;
  var minCal = 0;
  var maxCal = 0;
  var minResults = 0;
  var maxResults = 10;

  // AJAX call to get nutrient info
  function searchRecipes() {

      var queryURL = "https://api.edamam.com/search?q=chicken&app_id=6531ba09&app_key=e758518e6f7c22b5c2cdfc78272e0252&from=0&to=12&calories=000-500";

      $.ajax( {
          url: queryURL,
          method: "GET"
      }).then(function (response) {

          console.log(response);

          console.log(response.label);


          for (var i=0; i<response.hits.length; i++) {

              var recipeDiv = $('<div class="recipe">');
              var recipeCard = $('<figure class="item">');

              var image = response.hits[i].recipe.image;
              var recipeName = response.hits[i].recipe.label;
              var calories = (response.hits[i].recipe.calories).toFixed(2) + ' CALORIES';

              console.log(recipeName, calories);

              recipeDiv.append(
                  '<figure class="floatLeft">' + 
                      '<img src="' + image + '">' +
                      '<figcaption>' + recipeName + '<br>' + calories + '</figcaption>' +
                   '</figure>' + '<br>'
              );
              $('#recipe-display').append(recipeCard);

              recipeCard.append('<img src="' + image + '">' + '<figcaption>' + recipeName + '<br>' + calories + '</figcaption>');
              // $("#carousel").prepend('<figure class="mySlides">' + '<img src="' + image + '">' + '<figcaption>' + recipeName + '<br>' + calories + '</figcaption>' + '</figure>' + '<br>');
              $("#carousel").prepend(recipeCard);

              $('#recipe-table > tbody').append("<tr><td>" + '<img width="100px" src="' + image + '">' + "</td><td>" + recipeName + "</td><td>" +
              calories + "</td></tr>");

              // showDivs();
          }
          showDivs()
      });
  }

  function showDivs(n) {
    var i;
    var x = document.getElementByClassName("mySlides");
    if (n > x.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }
    x[slideIndex-1].style.display = "block";  
  }

  searchRecipes();


})