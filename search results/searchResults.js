var jsonData = {};
var omdbArray = [];

// --- outdated, dont use
function jsonGrab(queryURL){
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        return response;
    });
        // --- outputs JSON data so there's no need to reuse code
}

// --- search function
$(document).on("click", "#movie-button",function(event){
    event.preventDefault();

    var input = $("#search-input").val();
    console.log(input);

    input.split(' ').join('+');
    tmdbURL = "https://api.themoviedb.org/3/search/multi?api_key=d19279e423255c630256c57ee162db9f&language=en-US&page=1&include_adult=false&query="+input;
    var tmdbData = {};

    $.ajax({
        url: tmdbURL,
        method: "GET",
    }).then(function(response){
        jsonData = response;
        tmdbData = response;

        populateList(tmdbData);
    });

    $(".information").empty();
});

// --- --- --- translates TMDB code into actual parsable genre --- --- ---
function printGenres(genreData){
    var genres = [{ "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" }, { "id": 16, "name": "Animation" },
        { "id": 35, "name": "Comedy" }, { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" }, { "id": 18, "name": "Drama" },
        { "id": 10751, "name": "Family" }, { "id": 14, "name": "Fantasy" }, { "id": 36, "name": "History" }, { "id": 27, "name": "Horror" },
        { "id": 10402, "name": "Music" }, { "id": 9648, "name": "Mystery" }, { "id": 10749, "name": "Romance" }, { "id": 878, "name": "Science Fiction" },
        { "id": 10770, "name": "TV Movie" }, { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" }, { "id": 37, "name": "Western" },
        {"id":10759,"name":"Action & Adventure"},{"id":10751,"name":"Family"},{"id":10762,"name":"Kids"},
        {"id":10763,"name":"News"},{"id":10764,"name":"Reality"},{"id":10765,"name":"Sci-Fi & Fantasy"},{"id":10766,"name":"Soap"},{"id":10767,"name":"Talk"},
        {"id":10768,"name":"War & Politics"}];

    var genreOutput = [];
    var j = 0;

    for(var i=0 ; i < genres.length ; i++){
        if(genres[i].id == genreData[j]){
            genreOutput[j] = genres[i].name;
            j++;
        }
    }

    return genreOutput;
}

// --- --- --- makes a new row of data for the table --- --- ---
function tables(tmdbData){
  
    var tmdbTitle = tmdbData.title;
    var omdbURL = "https://www.omdbapi.com/?t="+tmdbTitle+"&y=&plot=short&apikey=trilogy";

    console.log(tmdbData);

    $.ajax({
        url: omdbURL,
        method: "GET"
    }).then(function(response){
        var omdbData = response;
        console.log(omdbData);

        if(omdbData.Error != "Movie not found!" || omdbData.Response != "false" || omdbData.Title != "Undefined"){
            var newRow = $("<tr>");
            newRow.attr("id",tmdbTitle);

            var name = $("<th>");
            name.attr("data-name",tmdbTitle);
            var nameLink = $("<a>");
            nameLink.addClass("show-link");
            nameLink.attr("data-show-type",tmdbData.media_type);
            nameLink.text(tmdbTitle);
            name.append(nameLink);
            // --- value for the temporary array
            nameLink.attr("id",listPlace);
            console.log("list location: "+listPlace);
            
            tmdbInfo[listPlace] = tmdbData;
            listPlace++;

            var rating = $("<th>");
            rating.text(tmdbData.vote_average);
            rating.addClass("show-review");

            var genres = $("<th>");
            genres.text(printGenres(tmdbData.genre_ids));
            genres.addClass("show-genres");

            var length = $("<th>");
            length.text(omdbData.Runtime);
            length.addClass("show-runtime");

            var rated = $("<th>");
            rated.text(omdbData.Rated);
            rated.addClass("show-rating");

            var type = $("<th>");
            type.text(tmdbData.media_type);
            type.attr("data-show-type",tmdbData.media_type);
            type.addClass("show-type");

            $("tbody").append(newRow);

            newRow.append(rated).append(rating).append(name).append(type).append(length).append(genres);
        }

        // if(tmdbData.media_type == "movie"){
        //     nameLink.attr("data-link","movie-test.html");
        // } else if(tmdbData.media_type == "tv") {
        //     nameLink.attr("data-link","tv-test.html");
        // }
    });
}

// --- --- --- loop function for populating tables --- --- ---
var tmdbInfo = [];
var listPlace;

function populateList(tmdb){
    var tmdbList = tmdb.results;
    listPlace = 0;

    // --- copies tmdb list into temporary array
    // --- legacy --- tmdbInfo = tmdbList;

    var newTable = $("<table>");
    newTable.attr("id","search-table");
    var newthread = $("<thread>");
    newthread.attr("id","search-thread");
    var newTbody = $("<tbody>");
    newTbody.attr("id","search-tbody");
    var newRow = $("<tr>");
    newRow.attr("id","search-categories");

    // --- chain appends onto parent divs
    $(".information").append(newTable);
    $("#search-table").append(newthread);
    $("#search-thread").append(newTbody);
    $("#search-tbody").append(newRow);
    
    var searchTitle = $("<th>");
    searchTitle.addClass("show-title");
    searchTitle.text("Title");

    var searchRating = $("<th>");
    searchRating.addClass("show-rating")
    searchRating.text("Rating");

    var searchType = $("<th>");
    searchType.addClass("show-type");
    searchType.text("Type");

    var searchRuntime = $("<th>");
    searchRuntime.addClass("show-runtime");
    searchRuntime.text("Runetime");

    var searchGenre = $("<th>");
    searchGenre.addClass("show-genres")
    searchGenre.text("Genre(s)");

    var searchReview = $("<th>");
    searchReview.addClass("show-review");
    searchReview.text("Reviewer Score");

    // --- append to parent in order
    newRow.append(searchRating).append(searchReview).append(searchTitle).append(searchType).append(searchRuntime).append(searchGenre);

    // --- populates the table with actual show data
    for(var i=0 ; i < tmdbList.length ; i++){
        tables(tmdbList[i]);
    }
}

// --- --- --- show details --- --- ---
$(document).on("click", ".show-link",function(){
    var sendInfo = $(this).text();
    console.log(sendInfo);

    // --- grab list location
    var showTitle = parseInt($(this).attr("id"));
    console.log("picked location: "+showTitle);

    showDetails(tmdbInfo[showTitle]);
});

function showDetails(details){
    $(".information").empty();
    console.log(details);

    var omdb;
    var detailTitle = details.title;
    detailTitle.split(' ').join('+');

    var movieID = "";
    var tvID = "";

    var omdbURL = "https://www.omdbapi.com/?t="+detailTitle+"&y=&plot=short&apikey=trilogy";

    $.ajax({
        url: "https://api.themoviedb.org/3/movie/"+details.id+"/videos?api_key=d19279e423255c630256c57ee162db9f&language=en-US",
        method: "GET"
    }).then(function(response){
        movieID = response.results[0].key;
        console.log("movieID: "+movieID);
    }).then($.ajax({
        url: "https://api.themoviedb.org/3/tv/"+details.id+"/videos?api_key=d19279e423255c630256c57ee162db9f&language=en-US",
        method: "GET"
    }).then(function(response){
        tvID = response.results[0].key;
        console.log("tv ID: "+tvID);
    }).then($.ajax({
        url: omdbURL,
        method: "GET"
    }).then(function(response){
        omdb = response;

        var showTitle = $("<div>");
        showTitle.append("<h2 id='title-div'>"+detailTitle+"</h2>")

        // --- plot summary
        var description = $("<div>");
        description.append("<h3 id='plot-div'>Plot</h3>");
        description.append(details.overview);

        // --- list of general info
        var detail = $("<div>");
        detail.append("<h3>Details</h3>");
        detail.append("<ul id='details-list'>");
        detail.append("<li>Release Date: "+details.release_date+"</li>");
        detail.append("<li>Type: "+details.media_type+"</li>");
        
        if(details.media_type === "movie"){
            detail.append("<li>Runtime: "+omdb.Runetime+"</li>");
            detail.append("<li>Director: "+omdb.Director+"</li>");
            detail.append("<li>Cast :"+omdb.Actors+"</li>");
        }
        detail.append("<li>Genres: "+printGenres(details.genre_ids)+"</li>");
        detail.append("<li>Average Rating: "+details.vote_average+"</li>");

        // --- promo image
        var poster = $("<img id='poster-image'>");
        poster.attr("src","https://image.tmdb.org/t/p/w500/"+details.poster_path);

        // --- trailer
        var video = $("<div id='trailer-video'>");
        var videoDiv = $('<iframe width="560" height="315" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>');
        // --- was previously $('<object width="560" height="315">')
        
        video.append(videoDiv);
        if(details.media_type != "movie"){ // --- if is tv show
            videoDiv.attr("src","https://www.youtube.com/embed/"+tvID);
        } else { // --- if is for movies
            videoDiv.attr("src","https://www.youtube.com/embed/"+movieID);
        }
        
        // --- append it onto the div
        $(".information").append(showTitle);
        $(".information").append(description);
        $(".information").append(poster);
        $(".information").append(detail);
        $(".information").append(video);
    })));

    // $.ajax({
    //     url: omdbURL,
    //     method: "GET"
    // }).then(function(response){
    //     omdb = response;

    //     var showTitle = $("<div>");
    //     showTitle.append("<h2 id='title-div'>"+detailTitle+"</h2>")

    //     var description = $("<div>");
    //     description.append("<h3 id='plot-div'>Plot</h3>");
    //     description.append(details.overview);

    //     var detail = $("<div>");
    //     detail.append("<h3>Details</h3>");
    //     detail.append("<ul id='details-list'>");
    //     detail.append("<li>Release Date: "+details.release_date+"</li>");
    //     detail.append("<li>Type: "+details.media_type+"</li>");
    //     if(details.media_type === "movie"){
    //         detail.append("<li>Runtime: "+omdb.Runetime+"</li>");
    //         detail.append("<li>Director: "+omdb.Director+"</li>");
    //         detail.append("<li>Cast :"+omdb.Actors+"</li>");
    //     }
    //     detail.append("<li>Genres: "+printGenres(details.genre_ids)+"</li>");
    //     detail.append("<li>Average Rating: "+details.vote_average+"</li>");

    //     var poster = $("<img id='poster-image'>");
    //     poster.attr("src","https://image.tmdb.org/t/p/w500/"+details.poster_path);

    //     var video = $("<div id='trailer-video'>");
    //     var videoDiv = $("<iframe>");
    //     var videoID;
    //     video.append(videoDiv);
    //     if(details.media_type === "movie"){
    //         // --- grab youtube ID
    //         $.ajax({
    //             url: "https://api.themoviedb.org/3/movie/"+details.id+"/videos?api_key=d19279e423255c630256c57ee162db9f&language=en-US",
    //             method: "GET"
    //         }).then(function(response){
    //             videoID = response.results[0].key;
    //             // --- pass video id into youtube
    //             videoDiv.attr("src","https://www.youtube.com/embed/"+videoID);

    //             $(".information").append(showTitle);
    //             $(".information").append(description);
    //             $(".information").append(poster);
    //             $(".information").append(detail);
    //             $(".information").append(video);
    //         });
    //     } else if(details.media_type === "tv"){
    //         // --- grab youtube ID
    //         $.ajax({
    //             url: "https://api.themoviedb.org/3/tv/"+details.id+"/videos?api_key=d19279e423255c630256c57ee162db9f&language=en-US",
    //             method: "GET"
    //         }).then(function(response){
    //             videoID = response.results[0].key;
    //             // --- pass id into youtube
    //             videoDiv.attr("src","https://www.youtube.com/embed/"+videoID);

    //             $(".information").append(showTitle);
    //             $(".information").append(description);
    //             $(".information").append(poster);
    //             $(".information").append(detail);
    //             $(".information").append(video);
    //         });
    //     }
    // });
}
