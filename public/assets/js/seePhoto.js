const file = document.querySelector(".uploadfile");
const preview = document.querySelector("#preview");
file.onchange = () => {
    var fileList = file.files;

    // 읽기
    var reader = new FileReader();
    reader.readAsDataURL(fileList[0]);

    // 로드 한 후
    if (preview) {
        reader.onload = function () {
            preview.src = reader.result;
            preview.setAttribute("style", "margin-top: 5%");
        };
    }
};
