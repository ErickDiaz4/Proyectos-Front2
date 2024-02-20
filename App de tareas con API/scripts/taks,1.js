//Debe haber información del usuario en el locale storage, si no debemos regresar a la pagina de inicio

if (!localStorage.getItem("jwt")) {
  //console.log("no hay nada en el storage");
  location.replace("./index.html");
}

  //capturamos los elemntos necesarios
  const url = "https://todo-api.ctd.academy/v1";
  const urlTareas = `${url}/tasks`;
  const urlUsuario = `${url}/users/getMe`;
  const token = JSON.parse(localStorage.jwt);

  //empezamos la funcion con un load cargando el documento
  window.addEventListener("load", () => {
  //1 funcion, debemos cerrar cesión con el boton
    const btnCerraresion = document.querySelector("#closeApp");
    btnCerraresion.addEventListener("click", () => {
    const cerrarSesion = confirm("¿Desea volver al login?");
    //console.log("capturado");
    if (cerrarSesion) {
      localStorage.clear();
      location.replace("./index.html");
    }
  });

  obtenerNombrUsuario();
  nuevaTarea()
  obtenerTareas()

});


  //1) debemos obtener el nombre del usuario [Get]
  const obtenerNombrUsuario = () => {
    const settings = {
      method: "GET",
      headers: {
        authorization: token,
      },
    };

    fetch(urlUsuario, settings)
      .then((response) => {
        // console.log(response);
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      })
      .then((date) => {
        // console.log(date.firstName);
        const nombre = date.firstName;
        const change = document.querySelector(".user-info p");
        change.textContent = nombre;
        // console.log(change);
      })
      .catch((err) => {
        if (err == 404 || err == 500) {
          console.log("El usuario no existe, Error del servidor");
        }
      });
  };

  //2 Vamos a crear una nueva tarea
  const nuevaTarea = () => {
    const crearTarea = document.querySelector(".nueva-tarea");
  const nuevTarea = document.querySelector("#nuevaTarea")
  //   console.log(crearTarea);

  crearTarea.addEventListener("submit", (e) => {
    e.preventDefault()

    //console.log(nuevTarea.value);

    //console.log("evento disparado");
    const payload = {
        description : nuevTarea.value.trim(),
        completed : false
    }

    const settings = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json',
        authorization: token
      },
    };

    fetch(urlTareas, settings)
    .then(response => {
        //console.log(response);
        if (response.ok) {
            return response.json()
        }
        return Promise.reject(response)
    })
    .then(data => {
        //console.log(data);
        //console.log("soy data 1");
        obtenerTareas()
    })
    .catch(err => {console.log(err);})
    
    crearTarea.reset()
  });
}

const obtenerTareas = () => {

    const settings = {
        method: "GET",
        headers: {
            authorization : token
        }  
    }

    fetch(urlTareas , settings)
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        return Promise.reject(response)
    })
    .then(data => {
      //console.log(data);
      renderizarTarea(data);
      cambiarEstadoTarea();
      eliminarTarea()
    })
}

//3 renderizar tareas
const renderizarTarea = (data) => {
    let pendientes = document.querySelector(".tareas-pendientes");
    let terminadas = document.querySelector(".tareas-terminadas")
    let cantidadFinalizadas = document.querySelector("#cantidad-finalizadas")

    pendientes.innerHTML = ""
    terminadas.innerHTML = ""

    let contenedor = 0
    cantidadFinalizadas.textContent = contenedor 

    data.forEach(datos => {
      let fecha = new Date(datos.createdAt);

      if (datos.completed) {
        contenedor++

        terminadas.innerHTML += `<li class="tarea">
        <div class="hecha">
          <i class="fa-regular fa-circle-check"></i>
        </div>
        <div class="descripcion">
          <p class="nombre">${datos.description}</p>
          <div class="cambios-estados">
            <button class="change incompleta" id="${datos.id}"><i class="fa-solid fa-rotate-left"></i></button>
            <button class="borrar" id="${datos.id}"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      </li>`;
      }else {
        pendientes.innerHTML += `
        <li class="tarea">
        <button class="change" id="${
          datos.id
        }"><i class="fa-regular fa-circle"></i></button>
        <div class="descripcion">
          <p class="nombre">${datos.description}</p>
          <p class="timestamp">${fecha.toLocaleDateString()}</p>
        </div>
        <div class="cambiosEstados">
            <button class="borrar" id="${datos.id}"><i class="fa-regular fa-trash-can"></i></button>
          </div>
      </li>`;
      }
    }); 
}

//cambiar tareas de estado

const cambiarEstadoTarea = () => {

  const botonCambioEstado = document.querySelectorAll(".change")
  botonCambioEstado.forEach((boton) => {
    boton.addEventListener("click", e => {
      const id = e.target.id
      const url = `${urlTareas}/${id}`
      
      const payload = { 
        description: "Aprender Javascript", 
        completed: false 
      };

      if (e.target.classList.contains("incompleta")) {
        payload.completed = false
        //console.log("soy false");
      }else{
        payload.completed = true
        //console.log("soy true");
      }

      const setting = {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "content-type": "application/json",
          "authorization": token,
        },
      };

      fetch(url, setting)
      .then(response => {
        //console.log(response.status);
        obtenerTareas()
      })
      .catch(err => console.log(err))
    })
  });
}

//eliminar una tarea

const eliminarTarea = () => {
botonEliminar = document.querySelectorAll(".borrar")

botonEliminar.forEach(boton => {
  boton.addEventListener("click", e => {
    let id = e.target.id
    let url = `${urlTareas}/${id}`

    const setting = {
      method: "DELETE",
      headers: {
        "content-type" : "application/json",
        "authorization" : token,
      },
    }
    
    fetch(url, setting)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      return Promise.reject(response)
    })
    .then(date => {
      console.log(date);
      location.reload()
    })
    .catch(err => {
      console.log(err)
    })
  })
});

}