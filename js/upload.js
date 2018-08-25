var blob;

function downloadBlob(extension){
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = "result"+extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function saveToBlob(data, type){

    newContent = "";
    for (var i = 0; i < data.length; i++) {
        newContent += String.fromCharCode(data.charCodeAt(i) & 0xFF);
    }
    var bytes = new Uint8Array(newContent.length);
    for (var i=0; i<newContent.length; i++) {
        bytes[i] = newContent.charCodeAt(i);
    }
    blob = new Blob([bytes], {type: type});

}


$(document).ready(function () {



    $("#file").fileinput({
        theme: 'fa',
        allowedFileExtensions: ['txt', 'zip'],
        previewFileIcon: '<i class="fa fa-file"></i>',
        allowedPreviewTypes: null, // set to empty, null or false to disable preview for all types
        previewFileIconSettings: {
            'docx': '<i class="fa fa-file-word-o text-primary"></i>',
            'xlsx': '<i class="fa fa-file-excel-o text-success"></i>',
            'pptx': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
            'jpg': '<i class="fa fa-file-photo-o text-warning"></i>',
            'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
            'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
        },
        slugCallback: function (filename) {
            return filename.replace('(', '_').replace(']', '_');
        }
    });

    $('#formId').submit(function (e) {



        var data = new FormData(this);



        if ($("input[title$='.zip']").attr("title") != undefined) {
            e.preventDefault();
            console.log("upload ZIP");
            uploadZip(data);
        } else if ($("input[title$='.txt']").attr("title") != undefined) {

            e.preventDefault();
            $(".dnfinput").css("display", "none");

            $(".dnfupload").fadeOut("slow", function () {
                $(".dnfcorrect").fadeIn();
            });


            console.log("upload TEXT");


            var xml;

            $.ajax({
                url: upload_txt_request,
                type: 'POST',
                data: new FormData(this),
                dataType: 'xml',
                processData: false,
                contentType: false
            }).then(function (data) {

                xml = data;

                var text = $(data).find("text").html();

                console.log("TEXT: " + text);
                $(".a").fadeOut();

                //hide loading Bar
                // $("#loading").fadeOut();
                $("#loadingCorrect").css("display", "none");
                $(".loadingdiv").css("display", "none");


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
                        } else {
                            console.log($(this).text() + " zum WB hinzufügen");
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


                let words = fracture + notinwb + nomistake;


                $('.fractureinfo').css("width", fracture + 10 + "px");
                $('.fractureinfo').text(fracture);

                $('.notinwbinfo').css("width", notinwb + 10 + "px");
                $('.notinwbinfo').text(notinwb);

                $('.nomistake').css("width", nomistake + 10 + "px");
                $('.nomistake').text(nomistake);


                $('.wordinfo').addClass("active");




            });
        }
    });


    function uploadZip(data) {

        console.log("trying to send ajax with: " + data);

        $(".dnfupload").css("display","none");

        $(".loading-zip-div").fadeIn();
        $(".loading-zip-div").fadeIn("slow");
        $(".loading-zip-div").fadeIn(10000);

        $.ajax({
            url: upload_zip_request,
            type: 'POST',
            data: data,
            dataType: 'text',
            mimeType: 'text/plain; charset=x-user-defined',
            processData: false,
            contentType: false
        }).then(function (data) {
            //save results into blob
            saveToBlob(data, "application/zip");

            $(".loading-zip-div").css("display","none");


            //download
            $("#download-zip").on("click",function () {
                downloadBlob(".zip");
            });


            $(".dnf-zip-download").fadeIn();
            $(".dnf-zip-download").fadeIn("slow");
            $(".dnf-zip-download").fadeIn(10000);

        });
    }






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


