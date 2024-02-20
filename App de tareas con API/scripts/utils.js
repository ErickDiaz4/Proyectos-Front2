 const tomarErrores = (mensagge, campo, isTrue = false) => {
    console.log(mensagge, campo, isTrue);
    if (isTrue) {
        campo.nextElementSibling.style.color = "blue";
        campo.nextElementSibling.textContent = mensagge
    }else{
        campo.nextElementSibling.style.color = "red"
        campo.nextElementSibling.textContent = mensagge;
    }
 }

 const isEmpty = (mensagge, e) => {

 }


/* ---------------------------------- texto --------------------------------- */
function normalizarTexto(texto) {
    return texto.trim();
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(e) {
    const campo = e.target
    const campoValue = normalizarTexto(campo.value)
    // console.log(campo);
    // console.log(campoValue);

    const regexCorreo = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);

    if(!regexCorreo.test(campoValue)){
        tomarErrores(`Llenar el ${campo.name} correctamente`, campo)
    }else{
        tomarErrores(`El ${campo.name} es correcto`, campo, true);
    }
}

function normalizarEmail(texto) {
  return texto.trim();
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(e) {
    const campo = e.target
    const campoValue = normalizarTexto(campo.value)

    const regexContraseña = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

    if (!regexContraseña.test(campoValue)) {
        tomarErrores(`Llenar el ${campo.name} correctamente`, campo);
    }else {
        tomarErrores(`El ${campo.name} es correcto`, campo, true);
    }
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    
}

