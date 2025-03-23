function uploadFiles(obj) {
    var file = Utilities.newBlod(obj.bytes, obj.mimeType, obj.filename);
    var folder = DriveApp.getFolderById('1wq9JrxaLvTlglq9Ti6cS93dvIu5xWnGy');
    var createFile = folder.createFile(file);
    return createFile.getId();
}



/*musetra miniatura de imagen*/

document.getElementById("imgInput").addEventListener('change', handleFiles, false);


function handleFiles(f) {

    const files = document.getElementById('imgInput').files;
    var previewDiv = document.getElementById('preview').innerHTML = '';

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /image.*/;
        if (!file.type.match(imageType)) {
            continue;
        }

        var img = document.createElement("img");
        img.classList.add("obj");
        img.file = file;
        preview.appendChild(img);

        var reader = new FileReader();
        reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(file);
    }
}

function uploadFile() {
    const selectedFile = document.getElementById('imgInput').files[0];

    const imgs = document.querySelectorAll(".obj");
    for (let i = 0; i < imgs.length; i++) {
        new fileUpload(imgs[i], imgs[i].file);
        console.log(imgs[i], imgs[i].file)
    }
}





function fileUpload(img, file) {
    var reader = new FileReader();
    reader.onload = function(event) {
        //console.log(event.target.result)
        const obj = {
            filename: file.name,
            mimeType: file.type,
            bytes: [...new Int8Array(event.target.result)]
        };
        //console.log(obj.bytes);

        .whithSuccessHandler((e) => console.log(e))
            .uploadFiles(obj);
    };
    reader.readAsArrayBuffer(file);
};