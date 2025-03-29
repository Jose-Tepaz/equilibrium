const url = 'https://api.airtable.com/v0/appJ9zfWOiOA8k0El/tblLrIw5BKGXGbcuV';


const token = 'pat1BopI8nQaGzvCI.4da5c9170bd39ad23a44af11f9fbcdc70d5aa8ea1cb7a59a01abca0a2d0e57d2';

const configId = 'recuihJiAK2qfco4c';

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
        return;
    }

    // Show loading state
    searchFormBtn.innerHTML = '<span class="loader">Validando datos...</span>';
    searchFormBtn.disabled = true;

    const nombre = inputName.trim();
    const apellido = inputApellido.trim();
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
    console.log(textoConvertido);

    obtenerDatosAutenticados(textoConvertido, nombre, apellido)
        .finally(() => {
            // Reset button state after request completes
            searchFormBtn.innerHTML = 'Enviar';
            searchFormBtn.disabled = false;
        });
});


//convierte a minusculas y quita tildes



const concat = 'filterByFormula=Find(%22preubauno@gmail.com%22%2C+Correo)';

/*FUNCION QUE ENVIA EL ID Y LOS DATOS DE MEDICOS PARA LUEGO UTILIZARSE AL ACTUALIZAR DATOS */
async function obtenerDatosAutenticados(nombreCompleto, nombre, apellido) {
    //const urlConParametros = `${url}?${parametrosCodificados}`;

    try {
        const response = await fetch(`https://api.airtable.com/v0/appJ9zfWOiOA8k0El/tblLrIw5BKGXGbcuV?filterByFormula=Find(%22${nombreCompleto}%22%2C+Name)`, {
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
    //nameInput.value = nobre;
    //apellidoInput.value = apellido;

    emailInput.value = correoApi || '';
    console.log(nobre, apellido)

    // Obtener el select de país y el div contenedor del estado
    const paisSelect = document.querySelector("#paisSelect");
    const estadoSelect = document.querySelector("#estadoSelect");
    const estadoContainer = document.querySelector("#wrapper-estado");

    // Manejar cambios en el select de país
    paisSelect.addEventListener("change", function() {
        const selectedValue = this.options[this.selectedIndex].value;
        if (selectedValue === "México") {
            estadoContainer.classList.remove("hidden");
            estadoSelect.setAttribute("required", "required");
        } else {
            estadoContainer.classList.add("hidden");
            estadoSelect.removeAttribute("required");
        }
    });




    btnStep3.addEventListener("click", () => {
        //const nameValue = document.getElementById("nameInput").value;
        //const apellidoValue = document.getElementById("apellidoInput").value;

        const emailValue = document.getElementById("emailInput").value;
        const phoneValue = document.getElementById("phoneInput").value;
        const hobbieValue = document.getElementById("hobbieInput").value;
        const paisValue = document.getElementById("paisSelect").value;
        const estadoValue = document.getElementById("estadoSelect").value;
        const especialidadValue = document.getElementById("especialidadSelect").value;

        const radioSeleccionado = document.querySelector('input[name="edad"]:checked');





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
        }
        // Validar que el teléfono solo contenga números y tenga entre 7 y 10 dígitos
        const phoneRegex = /^\d{7,10}$/;
        if (phoneValue.length == 0 || !phoneRegex.test(phoneValue)) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Introduce un número de teléfono válido</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',
                }
            })
            return;
        }
        if (hobbieValue.length == 0) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Introduce un hobbie</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',
                }
            })
            return;
        }
        if (paisValue.length == 0) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Elije un país</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',
                }
            })
            return;
        }

        // Solo validar estado si México está seleccionado
        if (paisValue === "México" && estadoValue.length == 0) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Elije un estado</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',
                }
            })
            return;
        }

        if (especialidadValue.length == 0) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Elije una especialidad</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',
                }
            })
            return;
        }

        // Validar que se haya seleccionado una opción de edad
        if (!radioSeleccionado) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Selecciona una edad</h4>',
                confirmButtonColor: '#3792E6',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn-siguiente',
                    popup: 'popAlert',
                }
            })
            return;
        } else {
            actualizarDatos(emailValue, idApi, phoneValue, hobbieValue, paisValue, estadoValue, especialidadValue, radioSeleccionado);
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
async function actualizarDatos(emailValue, idApi, phoneValue, hobbieValue, paisValue, estadoValue, especialidadValue, radioSeleccionado) {
    try {
        // Crear el objeto de datos solo con los campos que tienen valor
        const fields = {
            "Correo": emailValue,
            "Telefono": phoneValue,
            "Hobbie": hobbieValue,
            "Pais": paisValue,
            "Especialidad": especialidadValue,
            "Edad": radioSeleccionado.value
        };

        // Solo agregar el estado si el país es México
        if (paisValue === "México") {
            fields["Estado"] = estadoValue;
        }

        // Log para debugging
        console.log('Datos a enviar:', fields);

        const response = await fetch(`https://api.airtable.com/v0/appJ9zfWOiOA8k0El/tblLrIw5BKGXGbcuV/${idApi}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "fields": fields
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(`Error al actualizar datos: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Datos actualizados exitosamente:', data);
        return data;

    } catch (error) {
        console.error('Error en actualizarDatos:', error);
        Swal.fire({
            icon: 'error',
            html: '<h4 class="title-2">Error al actualizar los datos</h4>',
            confirmButtonColor: '#3792E6',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn-siguiente',
                popup: 'popAlert',
            }
        });
        throw error;
    }
}

/* FUNCION PARA OBTENER EL ACTUAL VALOR INCREMENTAL */
const getAutoIncrement = async() => {
    const response = await fetch(`https://api.airtable.com/v0/appJ9zfWOiOA8k0El/tblLrIw5BKGXGbcuV/${configId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const row = await response.json()
    if (row) return row.fields.RegisterAutoincrement
    return 0
}

/* FUNCION PARA ACTUALIZAR EL VALOR INCREMENTAL */
const updateAutoIncrement = async(lastValue) => {
    const response = await fetch(`https://api.airtable.com/v0/appJ9zfWOiOA8k0El/tblLrIw5BKGXGbcuV/${configId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "fields": {
                "RegisterAutoincrement": lastValue + 1,
            }
        })
    })
    const row = await response.json()
    return row
}

/*ENVIA DATOS DE FACTURACION*/
const btnRegistrarseFact = document.getElementById("btnRegistrarse2");

function datosParaFactura(idApi) {
    const btnRegistrarseFact = document.getElementById("btnRegistrarse2");
    btnRegistrarseFact.addEventListener("click", async() => {
        const razonSocialValue = document.getElementById("razonSocialInput").value;
        const tPersona = document.getElementById('tPersona').value;
        const rFiscal = document.getElementById('regimenFiscal').value;
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
        if (rFiscal.length == 0) {
            Swal.fire({
                icon: 'error',
                html: '<h4 class="title-2">Selecciona un régimen fiscal</h4>',
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
                html: '<h4 class="title-2">Introduce tu RFC con homoclave</h4>',
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
                html: '<h4 class="title-2">Selecciona un uso CFDI</h4>',
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
            const lastValue = await getAutoIncrement()
            await enviaDatosFact(idApi, razonSocialValue, tPersona, rFiscal, rfcInput, cfdiInput, codigoPostal, inputFoto, lastValue)
            await updateAutoIncrement(lastValue)
        };
    });
};

function enviaDatosSinFact(idApi) {

    btnSinFact.addEventListener("click", async() => {
        const inputFoto2 = document.getElementById("user-photo").src;
        const lastValue = await getAutoIncrement()
        await registroSinFact(idApi, inputFoto2, lastValue)
        await updateAutoIncrement(lastValue)
    })
};
async function registroSinFact(idApi, inputFoto2, numeroAleatorio2) {
    const response = await fetch(`https://api.airtable.com/v0/appJ9zfWOiOA8k0El/tblLrIw5BKGXGbcuV/${idApi}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "fields": {
                "Comprobante": [{ "url": inputFoto2 }],
                "idNumber": numeroAleatorio2.toString().padStart(3, "0"),
                "Registrado": true,
            }
        })
    });
    console.log(response);
    succes();
}

async function enviaDatosFact(idApi, razonSocialValue, tPersona, rFiscal, rfcInput, cfdiInput, codigoPostal, inputFoto, numeroAleatorio) {
    const response = await fetch(`https://api.airtable.com/v0/appJ9zfWOiOA8k0El/tblLrIw5BKGXGbcuV/${idApi}`, {
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
                "Regimen-fiscal": rFiscal,
                "RFC-con-homoclave": rfcInput,
                "Categoria-CFDI": cfdiInput,
                "Codigo-postal": codigoPostal,
                "idNumber": numeroAleatorio.toString().padStart(3, "0"),
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