//const url = 'https://api.airtable.com/v0/apprdv76hfgT4g0Q0/tblEqxpfjVXcsQH6d?filterByFormula=Find(%22preubatres%40gmail.com%22%2C+Correo)';
const url = 'https://api.airtable.com/v0/apprdv76hfgT4g0Q0/tblEqxpfjVXcsQH6d?';
const token = 'patL2G2VZmSPorKpO.060fe110d16fb2a44764746ed912aafbfb11dd0213b909b3e2ad1e0f61af453c';

const searchFormInput = document.querySelector('#searchForm input');
const searchFormBtn = document.querySelector('#searchBtn');

/*FUNCION QUE VERIFICA SI EL CORREO DEL MEDICO EXISTE EN LA BASE DE DATOS */
searchFormBtn.addEventListener('click', () => {
    const inputName = document.getElementById('inputName').value;
    const inputApellido = document.getElementById('inputApellido').value;
    if (inputName.length == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',

            html: '<h4 class="text-alert">Algo salió mal, campo Nombre Vacío</h4>',
            confirmButtonColor: '#308BBE',

        })
    }

    if (inputApellido.length == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',

            html: '<h4 class="text-alert">Algo salió mal, campo de Apellido Vacío</h4>',
            confirmButtonColor: '#308BBE',
        })

    } else {

        const nombre = inputName;
        const apellido = inputApellido;
        const nombreCompleto = nombre + " " + apellido;
        console.log(nombreCompleto);
        obtenerDatosAutenticados(nombreCompleto, nombre, apellido);
    };

});

const concat = 'filterByFormula=Find(%22preubauno@gmail.com%22%2C+Correo)';

/*FUNCION QUE ENVIA EL ID Y LOS DATOS DE MEDICOS PARA LUEGO UTILIZARSE AL ACTUALIZAR DATOS */
async function obtenerDatosAutenticados(nombreCompleto, nombre, apellido) {
    //const urlConParametros = `${url}?${parametrosCodificados}`;

    try {
        const response = await fetch(`https://api.airtable.com/v0/apprdv76hfgT4g0Q0/tblEqxpfjVXcsQH6d?filterByFormula=Find(%22${nombreCompleto}%22%2C+Name)`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data.records['0'].fields.Registrado);

        if (data.records.length === 0) {
            console.log("no existe");
            correoNoexiste();

        } else if (data.records['0'].fields.Registrado === true) {
            console.log("ya esta registrado");
            yaRegistrado()

        } else {
            console.log("se ejecuto");
            correoExistente(data, nombre, apellido);

        }

    } catch (error) {
        console.log(error);
        console.log("no se ejecuto");
        correoNoexiste();
    }
};

/* FUNCION QUE MUESTRA ERROR DE CORREO NO EXISTE */
const wrappFormSearch = document.getElementById("wrapp-foorm-search");

function correoNoexiste() {
    correoNoExiste.classList.remove('inactive')
    medicoRegistrado.classList.add("inactive")
    correoExiste.classList.add('inactive')
    wrappFormSearch.classList.add('inactive')
};

/*Muestra Mensaje medico registrado */
const medicoRegistrado = document.getElementById("medicoRegistrado")

function yaRegistrado() {
    medicoRegistrado.classList.remove("inactive")
    correoExiste.classList.add('inactive')
    correoNoExiste.classList.add('inactive')
    wrappFormSearch.classList.add('inactive')

}

/*FUNCION QUE AVANZA A REGISTRO DE MEDICO */
function correoExistente(info, nobre, apellido) {
    medicoRegistrado.classList.add("inactive")
    correoExiste.classList.remove('inactive')
    wrappFormSearch.classList.add('inactive')

    correoNoExiste.classList.add('inactive')

    //console.log(info.records[0].fields.Name)
    const nameApi = info.records[0].fields.Name;
    const telefonoApi = info.records[0].fields.Telefono;
    const correoApi = info.records[0].fields.Correo;
    const paisApi = info.records[0].fields.Pais;
    const idApi = info.records[0].id;
    console.log(idApi);


    btProcederRegistro.addEventListener("click", () => {

        registroDeMedico(nameApi, telefonoApi, correoApi, paisApi, idApi, nobre, apellido);
        datosParaFactura(idApi);
        wapperformUpdate.classList.remove('inactive')
        wrapperLoadEmail.classList.remove('section-load-email')
        wrapperLoadEmail.classList.add('inactive');
        /*activa/desactiva-steps*/
        step1.classList.remove('step-active')
        step2.classList.add('step-active')

    });

};


/*FUNCION QUE ALMACENA DATOS APRA ENVIA DE ACTUALIZACION DE MEDICO*/
const formUploadImg = document.getElementById("wapperformUpdate2");

function registroDeMedico(nameApi, telefonoApi, correoApi, paisApi, idApi, nobre, apellido) {


    nameInput.value = nobre;
    apellidoInput.value = apellido;
    emailInput.value = correoApi;
    console.log(nobre, apellido)


    btnStep3.addEventListener("click", () => {

        const nameValue = document.getElementById("nameInput").value;
        const apellidoValue = document.getElementById("apellidoInput").value;
        const emailValue = document.getElementById("emailInput").value;
        actualizarDatos(nameValue, apellidoValue, emailValue, idApi);
        formUploadImg.classList.remove('inactive');
        wapperformUpdate.classList.add('inactive')
        step2.classList.remove('step-active')
        step3.classList.add('step-active')
    });


}

/*REGRESA AL PASO 2*/
previwStep2.addEventListener("click", () => {
    formUploadImg.classList.add('inactive')
    wapperformUpdate.classList.remove('inactive')
    step2.classList.add('step-active')
    step3.classList.remove('step-active')

});

/*REGRESA PASO 3*/
previewStep3.addEventListener("click", () => {
    formUploadImg.classList.remove('inactive');
    invoiceSection.classList.add('inactive');
    step3.classList.add('step-active');
    step4.classList.remove('step-active');
});




/*OCULTA SECCION SUBIR COMPROBANTE*/
const btnsiguienteFact = document.getElementById("btnsiguientefact");
const invoiceSection = document.getElementById("invoice-section")

btnsiguienteFact.addEventListener("click", () => {
    formUploadImg.classList.add('inactive')
    invoiceSection.classList.remove('inactive');
    step3.classList.remove('step-active');
    step4.classList.add('step-active');


})



/*FUNCION QUE ENVIA LOS DATOS DE CONTACTO DEL MEDICO*/
async function actualizarDatos(emailValue, idApi) {
    const response = await fetch(`https://api.airtable.com/v0/apprdv76hfgT4g0Q0/tblEqxpfjVXcsQH6d/${idApi}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "fields": {
                "Correo": emailValue,
            }
        })
    });
    console.log(response);

}



/*ENVIA DATOS DE FACTURACION*/
function datosParaFactura(idApi) {
    const btnRegistrarseFact = document.getElementById("btnRegistrarse2");
    btnRegistrarseFact.addEventListener("click", () => {
        const razonSocialValue = document.getElementById("razonSocialInput").value;
        const tPersona = document.getElementById('tPersona').value;
        const rfcInput = document.getElementById("rfcInput").value;
        const cfdiInput = document.getElementById("cfdiInput").value;
        const codigoPostal = document.getElementById("codigoPostal").value;
        const inputFoto = document.getElementById("user-photo").src;



        //if (razonSocialValue.length == 0) {
        //    Swal.fire({
        //        icon: 'error',
        //        title: 'Oops...',
        //
        //        html: '<h4 class="text-alert">Algo salió mal, campo Razon //social vacío</h4>',
        //        confirmButtonColor: '#308BBE',
        //    })
        //    return;
        //}
        //if (rfcInput.length == 0) {
        //    Swal.fire({
        //        icon: 'error',
        //        title: 'Oops...',
        //
        //        html: '<h4 class="text-alert">Algo salió mal, campo RFC //incorrecto o vacío</h4>',
        //        confirmButtonColor: '#308BBE',
        //    })
        //    return;
        //}
        //if (calleInput.length == 0) {
        //    Swal.fire({
        //        icon: 'error',
        //        title: 'Oops...',
        //
        //        html: '<h4 class="text-alert">Algo salió mal, campo Calle //incorrecto o vacío</h4>',
        //        confirmButtonColor: '#308BBE',
        //    })
        //    return;
        //} else {
        //    enviaDatosFact(idApi, razonSocialValue, tPersona, rfcInput, //cfdiInput, calleInput, noExterior, noInterior, codigoPostal, //localidadInput, municipioInput, estadoInput, inputFoto);
        //};

        enviaDatosFact(idApi, razonSocialValue, tPersona, rfcInput, cfdiInput, codigoPostal, inputFoto);

    });

}

async function enviaDatosFact(idApi, razonSocialValue, tPersona, rfcInput, cfdiInput, codigoPostal, inputFoto) {
    const response = await fetch(`https://api.airtable.com/v0/apprdv76hfgT4g0Q0/tblEqxpfjVXcsQH6d/${idApi}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "fields": {
                "Comprobante": [{ "url": inputFoto }],
                "Razon": razonSocialValue,
                "Tipo-de-persona": tPersona,
                "RFC-con-homoclave": rfcInput,
                "Categoria-CFDI": cfdiInput,
                "Codigo-postal": codigoPostal,
                "Registrado": true,
            }
        })
    });
    console.log(response);
    succes();


}

/*activa datos de facturacion*/
/*nods form facturación*/
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const dataFactura = document.getElementById("wrapper-data-factura");

const alertOk = document.getElementById("wrapper-ok");

function succes() {
    alertOk.classList.remove("inactive");
    alertOk.classList.add("succes-mesage");

    formFacturacion.classList.add('inactive');
}


btnSi.addEventListener("click", () => {
    dataFactura.classList.remove("inactive");

});
btnNo.addEventListener("click", () => {
    dataFactura.classList.add("inactive");


});


/*botones volver */


btnVolver.addEventListener("click", () => {
    wrapperLoadEmail.classList.add('section-load-email')
    wrapperLoadEmail.classList.remove('inactive');
    wapperformUpdate.classList.add('inactive');
    location.reload();
});

const btnVolver2 = document.getElementById("btnVolver2");
btnVolver2.addEventListener("click", () => {
    wapperformUpdate.classList.remove('inactive');
    formFacturacion.classList.add('inactive');

});