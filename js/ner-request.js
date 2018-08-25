var ner;

$(document).ready(function () {

    $("#toNER").on( "click", function() {



        $(".dnfcorrect").css("display","none");
        loading();

        let textContent = $(".a").text();

        $.ajax({
            dataType: 'xml',
            method: "POST",
            contentType: "text/plain",
            data: textContent,
            url: ner_request
        }).then(function (data) {
            ner = data;

            //convert xml to string and save in blob
            var xmlString = (new XMLSerializer()).serializeToString(data);
            textBlob = new Blob([xmlString]);

            //apply download function
            $("#download-ner").on("click",function () {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(textBlob);
                link.download = "result.xml";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });

            stopLoading();
            showText(ner);

        });

    });


    function loading() {
        $(".dnfNER").fadeIn();

    }


    function stopLoading(){
        $("#loadingNER").css("display","none");
        $(".loadingdivNER").css("display","none");
        $("#ner-headline").fadeIn();
    }


    function showText(ner){
        $("#download-ner").fadeIn();


        console.log(ner);

        let text;


        //get original text string
        $('cas\\:Sofa',ner).each(function (u) {
            if($(this).attr("sofaString")){
                text = $(this).attr("sofaString");
                $(".nerOutput").html(text);
                $(".nerOutput").fadeIn("slow");
                $(".nerOutput").fadeIn(10000);
                console.log($(this).attr("sofaString"));
            }

        });


        //get entitys
        $('types\\:EntityMention',ner).each(function (u) {

            let begin;
            if($(this).attr("begin")){
                begin = $(this).attr("begin");
                console.log("start:" + begin);
            }

            let end;
            if($(this).attr("end")){
                end = $(this).attr("end");
                console.log("end: "  + end);
            }

            console.log(text.substring(begin,end));


            //Mark Entitys
            $(".nerOutput").mark(text.substring(begin,end),{
                "separateWordSearch": false
            });
        });




    }



});
