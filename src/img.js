const boton_foto = document.querySelector('#btn-foto');
const cambiarImagen = document.querySelector('#cambiarImagen');
const imagen = document.querySelector('#user-photo');

let widget_cloudinary = cloudinary.createUploadWidget({
    cloudName: 'pdxnm9opuh',
    api_key: '877551654936893',
    uploadPreset: 'ean8fs4f',
    sources: ['local'],
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    maxFileSize: 5000000, // 5MB
    resourceType: 'auto',
    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
    multiple: false
}, (err, result) => {
    if (!err && result && result.event === 'success') {
        console.log('Imagen subida con éxito', result.info);
        imagen.src = result.info.secure_url;
        btnSIgUpload.classList.remove("inactive");
        cardDataBanc.classList.remove("wrapper-card-btn-upl");
        cardDataBanc.classList.add("inactive");
    }
});
boton_foto.addEventListener('click', () => {
    widget_cloudinary.open();
}, false);

cambiarImagen.addEventListener('click', () => {
    widget_cloudinary.open();
}, false);