
$(document).ready(function () {


    $("#dnfsendinput").on( "click", function() {

        $(".dnfinput").css("display","none");

        $(".dnfcorrect").fadeIn();

        var xml;

    $.ajax({
        dataType: 'xml',
        method: "POST",
        contentType: "text/plain",
        data: $("#textinput").val(),
        url: correct_request
    }).then(function (data) {
        xml = data;

        var text = $(data).find("text").html();

        console.log("TEXT: " + data);
        $(".a").fadeOut();

        //hide loading Bar
        // $("#loading").fadeOut();
        $("#loadingCorrect").css("display","none");
        $(".loadingdiv").css("display","none");



        //add XML to div container
        $(".a").html(text);
        $(".a").fadeIn();
        $(".a").fadeIn("slow");
        $(".a").fadeIn(10000);


        //Show buttons
        $(".correctBtns").fadeIn();
        $(".correctBtns").fadeIn("slow");
        $(".correctBtns").fadeIn(10000);


        let notinwb = 0;
        let fracture = 0;
        let nomistake = 0;
        $('word').each(function (u) {

            //Set 'word' attributes
            $(this).attr("contentEditable", "true");
            $(this).attr("edited", "false");

            //Set event handler
            $(this).on("focus", function () {
                $(this).css("background-color", "lightblue");
            });

            $(this).on("focusout", function () {
                if ($(this).attr("edited") == "false") {
                    //Set 'word' colors
                    if ($(this).attr("possibleFracture") == "true") {
                        //word most likley correct
                        $(this).css("background-color", "lightsalmon");
                    } else if ($(this).attr("inWB") == "true") {
                        //possible fracture case
                        $(this).css("background-color", "lightgreen");
                    } else {
                        //not found in wb
                        $(this).css("background-color", "lightcoral");
                    }
                } else{
                    console.log($(this).text()+" zum WB hinzufügen");
                }
            });

            $(this).on("input", function () {
                console.log($(this).text());
                $(this).attr("edited", "true");
                $(this).css("background-color", "lightblue");
            });


            //Set 'word' colors
            if ($(this).attr("possibleFracture") == "true") {
                //possible fracture case
                fracture++;
                $(this).css("background-color", "lightsalmon");
            } else if ($(this).attr("inWB") == "true") {
                //word most likley correct
                nomistake++;
                $(this).css("background-color", "lightgreen");
            } else {
                //not found in wb
                notinwb++;
                $(this).css("background-color", "lightcoral");
            }

        });
        //create context menu
        buildContextMenu(xml);


        let words= fracture+notinwb+nomistake;


        $('.fractureinfo').css("width",fracture+10+"px");
        $('.fractureinfo').text(fracture);

        $('.notinwbinfo').css("width",notinwb+10+"px");
        $('.notinwbinfo').text(notinwb);

        $('.nomistake').css("width",nomistake+10+"px");
        $('.nomistake').text(nomistake);


        $('.wordinfo').addClass("active");



    });
});


function buildContextMenu(xml) {
    //iterate over all word tags
    $('word', xml).each(function (i) {

        var origin = $(this).text();
        var bestGuess = $(this).attr("bestGuess");
        var mostSimString = $(this).attr("mostSimilar");
        var mostSim;
        if (mostSimString) {
            mostSim = mostSimString.split(" ");
        }

        var menu1 = [];

        var o1 = {};
        o1["Origin: " + origin] = function () {
            changeTextTo(origin, i)
        }
        menu1.push(o1);
        menu1.push($.contextMenu.separator);

        if (bestGuess != undefined) {
            var o2 = {};
            o2["Best guess: " + bestGuess] = function () {
                changeTextTo(bestGuess, i)
            }
            menu1.push(o2);
            menu1.push($.contextMenu.separator);
        }

        if (mostSim != undefined) {
            for (let j = 0; j < mostSim.length; ++j) {
                let current = mostSim[j];
                let oi = {};
                let tmp = current.toString();
                oi[current] = function () {
                    changeTextTo(tmp, i)
                }
                menu1.push(oi);
            }
        }

        $('#' + i).contextMenu(menu1, {theme: 'osx'});
    });


}


function changeTextTo(text, i) {
    console.log("Changed to " + text);

    $("#" + i).html(text);
    $("#" + i).css("background-color", "lightblue");
}


});





