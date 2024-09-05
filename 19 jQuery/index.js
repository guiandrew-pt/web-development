// $("h1").css("color", "blue");

// $("h1").addClass("big-title margin-50");
// $("h1").hasClass("big-title");

// $("h1").text("Hello");

// $("button").text("Don't Click Me");
// console.log($("img").attr("src"));
// $("a").attr("href", "https://wwww.yahoo.com");


/* $("h1").click(function() {
    $("h1").css("color", "purple")
}); */

$("button").click(function() {
    $("h1").css("color", "purple");
});

/* $("input").keypress(function(event) {
    console.log(event.key);
}); */

$("input").keypress(function(event) {
    // console.log(event.key);
    $("h1").text(event.key);
});

$("h1").on("mouseover", function() {
    $("h1").css("color", "blue");
});

/* 
$("h1").before("<button>New</button>");
$("h1").after("<button>New</button>");
$("h1").prepend("<button>New</button>");
$("h1").append("<button>New</button>");
$("button").remove(); 
*/

/* $("button").on("click", function() {
    $("h1").hide();
});

$("button").on("click", function() {
    $("h1").show();
}); */

/*
$("button").on("click", function() {
    $("h1").toggle();
});
*/

/*
$("button").on("click", function() {
    $("h1").fadeOut();
});

$("button").on("click", function() {
    $("h1").fadeIn();
});

$("button").on("click", function() {
    $("h1").fadeToggle();
});


$("button").on("click", function() {
    $("h1").slideUp();
});

$("button").on("click", function() {
    $("h1").slideDown();
});


$("button").on("click", function() {
    $("h1").slideToggle();
});


$("button").on("click", function() {
    $("h1").animate({opacity: 0.5});
});


$("button").on("click", function() {
    $("h1").slideUp().slideDown().animate({opacity: 0.5});
});
*/











