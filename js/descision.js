$(document).ready(function () {
    $("#desc-upload").on("click",function () {
        $(".dnfdesc").fadeOut("slow",function () { $(".dnfupload").fadeIn()});
    });

    $("#desc-edit").on("click",function () {
        $(".dnfdesc").fadeOut("slow",function () { $(".dnfinput").fadeIn()});
    });



});