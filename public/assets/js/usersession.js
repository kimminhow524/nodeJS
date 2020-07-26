$(document).ready(function () {
    var post = "POST METHOD CALL";

    //Ajax POST Method TEST
    $.ajax({
        url: "/api/post",
        dataType: "json",
        type: "POST",
        data: { data: post },
        success: function (result) {
            if (result.result != undefined) {
                $("#LoginUsername").html(result.result + "님 환영합니다!");
                $(".login").css("display", "none");
                $(".signup").css("display", "none");
                $(".logout").css("display", "inline");
            }
        },
    });
});
