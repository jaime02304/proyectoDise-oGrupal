$(document).ready(function () {
    //AÑADIR CLUB
  $("#registro-club").on("submit", function (event) {
    event.preventDefault(); // Evita el envío por defecto del formulario

    const contraseña = document.getElementById("contraseña2").value;
    const repetirContraseña =
      document.getElementById("repetir-contraseña").value;

    if (!contraseña || !repetirContraseña) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (contraseña !== repetirContraseña) {
      alert("Las contraseñas no coinciden.");
      document.getElementById("repetir-contraseña").focus();
      return;
    }

    const nombreUsuario = $("#usuarioR").val();

    // Comprobar si el nombre de usuario ya existe
    $.ajax({
      url: `http://localhost:3000/clubs?nombre=${nombreUsuario}`, // Ajusta esta URL según tu API
      type: "GET",
      success: function (response) {
        if (response.length > 0) {
          alert("No se puede registrar con ese nombre, ya existe.");
        } else {
          // Si el nombre no existe, procede con el registro
          alert("Se ha registrado correctamente.");

          // Obtener los datos del formulario
          const formData = {
            nombre: nombreUsuario,
            contrasenia: contraseña,
            email: $("#correo").val(),
          };

          // Hacer la solicitud POST para añadir el club
          $.ajax({
            url: "http://localhost:3000/clubs",
            type: "POST",
            contentType: "application/json", // Indicar el tipo de contenido
            data: JSON.stringify(formData), // Convertir los datos a formato JSON
            success: function (response) {
              console.log("Club añadido:", response); // Mostrar el club añadido en consola
              console.log("Club añadido exitosamente"); // Mensaje de éxito
            },
            error: function (xhr, status, error) {
              console.error("Error al añadir el club:", error); // Mostrar error en consola
              alert("Error al añadir el club"); // Mensaje de error para el usuario
            },
          });
        }
      },
      error: function (xhr, status, error) {
        console.error("Error al comprobar el nombre de usuario:", error);
        alert("Error al comprobar el nombre de usuario");
      },
    });
  });

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //LOGIN CLUB
  $("#login-form").on("submit", function (event) {
    event.preventDefault();

    const nombre = $("#usuario").val().trim();
    const contraseña = $("#contrasenia").val().trim();

    // Verificar que se hayan ingresado los datos
    if (!nombre || !contraseña) {
      return alert("Por favor, completa todos los campos.");
    }

    // Realiza la consulta filtrando por usuario
    $.ajax({
      url: `http://localhost:3000/clubs?nombre=${nombre}`,
      method: "GET",
      contentType: "application/json",
      success: function (respuesta) {
        const mostrarDiv = $("#tarjetaInfo1"); // Seleccionar el div donde se mostrará el club
        mostrarDiv.empty();
        if (respuesta.length === 0) {
          return alert("Club no encontrado.");
        }
        console.log(respuesta[0]);
        const clubEncontrado = respuesta[0];
        if (clubEncontrado.contrasenia === contraseña) {
          localStorage.setItem("club", JSON.stringify(clubEncontrado));
          window.location.href = "index.html";
        } else {
          alert("Contraseña incorrecta.");
        }
      },
      error: function (xhr) {
        console.error("Error al iniciar sesión:", xhr.responseText);
        alert(
          "Hubo un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde."
        );
      },
    });
  });
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//MOSTRAR INFO CLUB
  const club = JSON.parse(localStorage.getItem("club")); // Obtener el usuario del localStorage
  const mostrarDiv = $("#tarjetaInfo1"); // Seleccionar el contenedor

  if (club) {
    // Limpiar el contenedor
    mostrarDiv.empty();

    // Crear un mensaje con la información del usuario
    const contenido = `
            <h2>Información del Usuario</h2>
            <p><strong>Nombre:</strong> ${club.nombre}</p>
            <p><strong>Email:</strong> ${club.email}</p>
            <p><strong>Otro Campo:</strong> ${club.otroCampo}</p> 
        `;

    // Añadir el contenido al contenedor
    mostrarDiv.append(contenido);
  } else {
    mostrarDiv.text("No hay información del usuario disponible."); // Mensaje si no hay información
  }

  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  //BORRAR CLUB
  $("#borrarV").on("input", function () {
    const inputText = $(this).val().trim();
    $("#botonD").prop("disabled", inputText === ""); // Habilita si hay texto, deshabilita si está vacío
  });

  // Maneja el clic en el botón de borrado
  $("#botonD").on("click", function (event) {
    event.preventDefault(); // Evita el envío del formulario

    // Obtiene el texto de entrada y elimina '/borrar'
    const inputText = $("#borrarV").val().trim();
    const nombreClub = inputText.replace("/Borrar", "").trim();
    console.log(nombreClub);

    // Valida que se haya ingresado un nombre de club
    if (!nombreClub) {
      alert("Por favor, ingresa un nombre de club válido.");
      return;
    }

    // Busca el club por nombre en la base de datos utilizando AJAX
    $.ajax({
      url: `http://localhost:3000/clubs?nombre=${nombreClub}`,
      type: "GET",
      success: function (data) {
        // Si no se encuentra ningún club, muestra un mensaje de alerta
        if (data.length === 0) {
          alert("Club no encontrado.");
          return;
        }

        // Obtiene el ID del club encontrado
        const clubId = data[0].id;

        // Si se encuentra el club, envía la solicitud de eliminación
        $.ajax({
          url: `http://localhost:3000/clubs/${clubId}`,
          type: "DELETE",
          success: function () {
            alert(`Club ${nombreClub} eliminado correctamente.`);
            $("#borrarV").val(""); // Limpia el campo de entrada
            $("#botonD").prop("disabled", true); // Deshabilita el botón

            const clubGuardado = JSON.parse(localStorage.getItem("club"));// Recupera el objeto 'club' desde localStorage y lo convierte de JSON a un objeto JavaScript
            if (clubGuardado && clubGuardado.nombre === nombreClub) {
              localStorage.removeItem("club");//se borra del almacenamiento local
              $("#tarjetaInfo1").text("No hay información del club disponible.");
            }
          },
          error: function () {
            alert("Error al eliminar el club.");
          },
        });
      },
      error: function () {
        alert("Error de conexión al servidor.");
      },
    });
  });
});
