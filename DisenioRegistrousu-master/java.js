$(document).ready(function() {
    $('#registro-club').on('submit', function(event) {
        event.preventDefault(); // Evita el envío por defecto del formulario

        const contraseña = document.getElementById("contraseña2").value;
        const repetirContraseña = document.getElementById("repetir-contraseña").value;

        if (!contraseña || !repetirContraseña) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (contraseña !== repetirContraseña) {
            alert("Las contraseñas no coinciden.");
            document.getElementById("repetir-contraseña").focus();
            return;
        }

        const nombreUsuario = $('#usuarioR').val();

        // Comprobar si el nombre de usuario ya existe
        $.ajax({
            url: `http://localhost:3000/clubs?nombre=${nombreUsuario}`, // Ajusta esta URL según tu API
            type: 'GET',
            success: function(response) {
                if (response.length > 0) {
                    alert("No se puede registrar con ese nombre, ya existe.");
                } else {
                    // Si el nombre no existe, procede con el registro
                    alert("Se ha registrado correctamente.");

                    // Obtener los datos del formulario
                    const formData = {
                        nombre: nombreUsuario,
                        contrasenia: contraseña,
                        email: $('#correo').val()
                    };

                    // Hacer la solicitud POST para añadir el club
                    $.ajax({
                        url: 'http://localhost:3000/clubs',
                        type: 'POST',
                        contentType: 'application/json', // Indicar el tipo de contenido
                        data: JSON.stringify(formData), // Convertir los datos a formato JSON
                        success: function(response) {
                            console.log('Club añadido:', response); // Mostrar el club añadido en consola
                            console.log('Club añadido exitosamente'); // Mensaje de éxito
                        },
                        error: function(xhr, status, error) {
                            console.error('Error al añadir el club:', error); // Mostrar error en consola
                            alert('Error al añadir el club'); // Mensaje de error para el usuario
                        }
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error('Error al comprobar el nombre de usuario:', error);
                alert('Error al comprobar el nombre de usuario');
            }
        });
    });

    $('#login-form').on('submit', function(event) {
        event.preventDefault();
    
        const nombre = $('#usuario').val().trim();
        const contraseña = $('#contrasenia').val().trim();
    
        // Verificar que se hayan ingresado los datos
        if (!nombre || !contraseña) {
            return alert("Por favor, completa todos los campos.");
        }
    
        // Realiza la consulta filtrando por usuario
        $.ajax({
            url: `http://localhost:3000/clubs?nombre=${nombre}`,
            method: 'GET',
            contentType: 'application/json',
            success: function(respuesta) {
                const mostrarDiv = $('#tarjetaInfo1'); // Seleccionar el div donde se mostrará el club
            mostrarDiv.empty();
                if (respuesta.length === 0) {
                    return alert("Usuario no encontrado.");
                }
                console.log(respuesta[0]);
                const usuarioEncontrado = respuesta[0];
                if (usuarioEncontrado.contrasenia === contraseña) {
                    localStorage.setItem('club', JSON.stringify(usuarioEncontrado));
                    window.location.href = 'index.html'; 
                   
                } else {
                    alert("Contraseña incorrecta.");
                }
            },
            error: function(xhr) {
                console.error('Error al iniciar sesión:', xhr.responseText);
                alert('Hubo un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
            }
        });
    });
});
