var socket = io();
// configuracion de leer por parametro lo que sea que venga como nombre del usuario
var params = new URLSearchParams(window.location.search);

// preguntamos si viene el nombre en los parametros
if (!params.has('nombre') || !params.has('sala')) {
    // si no viene ninguno de estos dos parametros me redirecciona al index
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}
// tenemos el params donde deberia venir el nombre, el nombre lo vamos a construir desde alli
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    // disparar un evento personalizado que le diga a mi backend quien soy yo
    socket.emit('entrarChat', usuario, function(resp){
        // la resp me va a regresar todos los usuarios conectados
        console.log('Usuarios conectados', resp)
    });

    // si alguien se conecta, ejecutamos un callback
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información - emit obvio emite
// socket.emit('crearMensaje', {
//     nombre: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información - on escucha
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje); // el servidor nos indica lo que sea que reciba
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat

socket.on('listaPersona', function(personas) {
    console.log(personas); // el servidor nos indica lo que sea que reciba
});

// * Mensajes privados
// esta es la acción del cliente de escuchar un mensaje privado
socket.on('mensajePrivado', function(mensaje){

    console.log('Mensaje privado:', mensaje);

});