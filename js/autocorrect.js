$(document).ready(function () {



    function autocorrect() {
        $('word').each(function (i){
            $(this).html($(this).attr("bestGuess"));
            $(this).attr("edited","true");
            $(this).css("background-color","lightblue");
        });
    }

    $("#autocorrect").on( "click", function() {
       autocorrect();
    });



    function autofractur() {
        $('word').each(function (i){
            if($(this).attr("possibleFracture")=="true") {
                $(this).attr("edited","true");
                $(this).html($(this).attr("bestGuess"));
                $(this).css("background-color", "lightblue");
            }
        });
    }

    $("#autofractur").on( "click", function() {
        autofractur();
    });






});