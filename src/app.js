//const url = 'https://api.airtable.com/v0/apprdv76hfgT4g0Q0/tblEqxpfjVXcsQH6d?filterByFormula=Find(%22preubatres%40gmail.com%22%2C+Correo)';
const url = 'https://api.airtable.com/v0/appeFAfvTztaVns2r/tblv3rIltOvDQhK4a?';
//const urlOld = 'https://api.airtable.com/v0/apprdv76hfgT4g0Q0/tblEqxpfjVXcsQH6d?';
const token = 'patg69zhgmdh3TAEs.ab2c8f573e00196c352b0b8e2ba3e969873ec1d7938f52376f839db3e847a75a';
//const tokenOld = 'patL2G2VZmSPorKpO.060fe110d16fb2a44764746ed912aafbfb11dd0213b909b3e2ad1e0f61af453c';

const searchFormInput = document.querySelector('#searchForm input');
const searchFormBtn = document.querySelector('#searchBtn');

/*FUNCION QUE VERIFICA SI EL CORREO DEL MEDICO EXISTE EN LA BASE DE DATOS */
searchFormBtn.addEventListener('click', () => {
    const inputName = document.getElementById('inputName').value;
    const inputApellido = document.getElementById('inputApellido').value;
    if (inputName.length == 0) {
        Swal.fire({
            icon: 'error',
            html: '<h4 class="title-2">Campo Nombre vacío</h4>',
            confirmButtonColor: '#3792E6',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn-siguiente',
                popup: 'popAlert',

            }
        })
        return;
    }

    if (inputApellido.length == 0) {
        Swal.fire({
            icon: 'error',
            html: '<h4 class="title-2">Campo Apellido vacío</h4>',
            confirmButtonColor: '#3792E6',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn-siguiente',
                popup: 'popAlert',

            }
        })

    } else {
        const nombre = inputName;
        const apellido = inputApellido;
        const nombreCompleto = nombre + " " + apellido;
        console.log(nombreCompleto);

        function convertirAMinusculasSinTildes(texto) {
            const mapaTildes = {
                'á': 'a',
                'é': 'e',
                'í': 'i',
                'ó': 'o',
                'ú': 'u',
                'Á': 'a',
                'É': 'e',
                'Í': 'i',
                'Ó': 'o',
                'Ú': 'u',
                'ñ': 'n',
                'Ñ': 'n'
            };

            return texto.toLowerCase().replace(/[áéíóúÁÉÍÓÚñÑ]/g, function(match) {
                return mapaTildes[match];
            });
        }


        let textoConvertido = convertirAMinusculasSinTildes(nombreCompleto);
        console.log(textoConvertido); // "hola, ¿como estas? el es mi compania."

        obtenerDatosAutenticados(textoConvertido, nombre, apellido);


    };








});


//convierte a minusculas y quita tildes






const concat = 'filterByFormula=Find(%22preubauno@gmail.com%22%2C+Correo)';

/*FUNCION QUE ENVIA EL ID Y LOS DATOS DE MEDICOS PARA LUEGO UTILIZARSE AL ACTUALIZAR DATOS */
async function obtenerDatosAutenticados(nombreCompleto, nombre, apellido) {
    //const urlConParametros = `${url}?${parametrosCodificados}`;

    try {
        const response = await fetch(`https://api.airtable.com/v0/appeFAfvTztaVns2r/tblv3rIltOvDQhK4a?filterByFormula=Find(%22${nombreCompleto}%22%2C+Name)`, {
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
        correoNoexistee();
    }
};

/* FUNCION QUE MUESTRA ERROR DE CORREO NO EXISTE */
const wrappFormSearch = document.getElementById("wrapp-foorm-search");

function correoNoexistee() {
    correoNoExiste.classList.remove('inactive');
    medicoRegistrado.classList.add("inactive");
    correoExiste.classList.add('inactive');
    wrappFormSearch.classList.add('inactive');
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
        enviaDatosSinFact(idApi);
        wapperformUpdate.classList.remove('inactive')
        wrapperLoadEmail.classList.remove('section-load-email')
        wrapperLoadEmail.classList.add('inactive');
        /*activa/desactiva-steps*/
        step1.classList.remove('step-active')
        step2.classList.add('step-active')
        step1m.classList.remove('step-active')
        step2m.classList.add('step-active')

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


        if (nameValue.length == 0) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Introduce tu nombre</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',

                }
            })
            return;
        }
        if (apellidoValue.length == 0) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Introduce tu apellido</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',

                }
            })
            return;
        }
        re = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
        if (!re.exec(emailValue)) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Introduce un correo válido</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',

                }
            })
            return;
        } else {
            actualizarDatos(emailValue, idApi);
            formUploadImg.classList.remove('inactive');
            wapperformUpdate.classList.add('inactive')
            step2.classList.remove('step-active')
            step3.classList.add('step-active')
            step2m.classList.remove('step-active')
            step3m.classList.add('step-active')
        }
    });
}

/*REGRESA AL PASO 2*/
previwStep2.addEventListener("click", () => {
    formUploadImg.classList.add('inactive')
    wapperformUpdate.classList.remove('inactive')
    step2.classList.add('step-active')
    step3.classList.remove('step-active')
    step2m.classList.add('step-active')
    step3m.classList.remove('step-active')
});

/*REGRESA PASO 3*/
previewStep3.addEventListener("click", () => {
    formUploadImg.classList.remove('inactive');
    invoiceSection.classList.add('inactive');
    step3.classList.add('step-active');
    step4.classList.remove('step-active');
    step3m.classList.add('step-active');
    step4m.classList.remove('step-active');
});

/*OCULTA SECCION SUBIR COMPROBANTE*/
const btnsiguienteFact = document.getElementById("btnsiguientefact");
const invoiceSection = document.getElementById("invoice-section")

btnsiguienteFact.addEventListener("click", () => {
    formUploadImg.classList.add('inactive')
    invoiceSection.classList.remove('inactive');
    step3.classList.remove('step-active');
    step4.classList.add('step-active');
    step3m.classList.remove('step-active');
    step4m.classList.add('step-active');
})

/*FUNCION QUE ENVIA LOS DATOS DE CONTACTO DEL MEDICO*/
async function actualizarDatos(emailValue, idApi) {
    const response = await fetch(`https://api.airtable.com/v0/appeFAfvTztaVns2r/tblv3rIltOvDQhK4a/${idApi}`, {
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
const btnRegistrarseFact = document.getElementById("btnRegistrarse2");

function datosParaFactura(idApi) {
    const btnRegistrarseFact = document.getElementById("btnRegistrarse2");
    btnRegistrarseFact.addEventListener("click", () => {
        const razonSocialValue = document.getElementById("razonSocialInput").value;
        const tPersona = document.getElementById('tPersona').value;
        const rfcInput = document.getElementById("rfcInput").value;
        const cfdiInput = document.getElementById("cfdiInput").value;
        const codigoPostal = document.getElementById("codigoPostal").value;
        const inputFoto = document.getElementById("user-photo").src;
        if (razonSocialValue.length == 0) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Introduce tu razón social</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',
                }
            })
            return;
        }
        if (tPersona.length == 0) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Selecciona un tipo de persona</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',
                }
            })
            return;
        }
        if (rfcInput.length == 0) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Intoduce tu  RFC con homoclave</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',
                }
            })
            return;
        }
        if (cfdiInput.length == 0) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="Selecciona un uso CFDI</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',
                }
            })
            return;
        }
        if (codigoPostal.length == 0) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Introduce tu código postal</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',
                }
            })
            return;
        } else {
            function generarNumeroAleatorio(minimo, maximo) {
                return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
            }
            let numeroAleatorio = generarNumeroAleatorio(1, 100000);
            console.log(numeroAleatorio);
            enviaDatosFact(idApi, razonSocialValue, tPersona, rfcInput, cfdiInput, codigoPostal, inputFoto, numeroAleatorio);
        };
    });
};

function enviaDatosSinFact(idApi) {

    btnSinFact.addEventListener("click", () => {
        const inputFoto2 = document.getElementById("user-photo").src;

        function generarNumeroAleatorio2(minimo, maximo) {
            return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
        }
        let numeroAleatorio2 = generarNumeroAleatorio2(1, 100000);

        registroSinFact(idApi, inputFoto2, numeroAleatorio2);

    })
};
async function registroSinFact(idApi, inputFoto2, numeroAleatorio2) {
    const response = await fetch(`https://api.airtable.com/v0/appeFAfvTztaVns2r/tblv3rIltOvDQhK4a/${idApi}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "fields": {
                "Comprobante": [{ "url": inputFoto2 }],
                "idNumber": numeroAleatorio2,
                "Registrado": true,
            }
        })
    });
    console.log(response);
    succes();
}




async function enviaDatosFact(idApi, razonSocialValue, tPersona, rfcInput, cfdiInput, codigoPostal, inputFoto, numeroAleatorio) {
    const response = await fetch(`https://api.airtable.com/v0/appeFAfvTztaVns2r/tblv3rIltOvDQhK4a/${idApi}`, {
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
                "idNumber": numeroAleatorio,
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

    //formFacturacion.classList.add('inactive');
}


btnSi.addEventListener("click", () => {
    dataFactura.classList.remove("inactive");
    btnRegistrarseFact.classList.remove("inactive");
    btnRegistrarseFact.classList.add("btn-t-2-finalizar");
    btnSinFact.classList.add("inactive");
    btnSinFact.classList.remove("btn-t-2-finalizar");
});

const btnSinFact = document.getElementById("btnRegistrarseSinfac");
btnNo.addEventListener("click", () => {
    dataFactura.classList.add("inactive");
    btnSinFact.classList.remove("inactive");
    btnSinFact.classList.add("btn-t-2-finalizar");
    btnRegistrarseFact.classList.add("inactive");
    btnRegistrarseFact.classList.remove("btn-t-2-finalizar");


});


/*botones volver */


//btnVolver.addEventListener("click", () => {
//    wrapperLoadEmail.classList.add('section-load-email')
//    wrapperLoadEmail.classList.remove('inactive');
//    wapperformUpdate.classList.add('inactive');
//    location.reload();
//});
//
//const btnVolver2 = document.getElementById("btnVolver2");
//btnVolver2.addEventListener("click", () => {
//    wapperformUpdate.classList.remove('inactive');
//    formFacturacion.classList.add('inactive');
//
//});