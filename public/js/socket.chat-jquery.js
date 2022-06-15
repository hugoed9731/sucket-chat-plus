var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');

// referencias de jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatBox = $('#divChatbox');

// Funciones para renderizar usuarios
function renderizarUsuarios(personas){ //[{},{},{}] - esperamos un arreglo mas o menos asi 

    console.log(personas);

    var html = '';

    html += '<li>';
    html += '     <a href="javascript:void(0)" class="active"> Chat de <span> '+ params.get('sala') + '</span></a>';
    html += '</li>';


    for(var i = 0; i < personas.length; i++) {
    html += '<li>';
    html +=     '<a data-id="'+ personas[i].id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ personas[i].nombre +' <small class="text-success">online</small></span></a>';
    html +=  '</li>';

    }

    
    divUsuarios.html(html); // su html va a ser igual al que acabo de contruir


}


function renderizarMensajes(mensaje, yo) {

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';
    if( mensaje.nombre === 'Administrador' ) {
        adminClass = 'danger';
    }

    if(yo) {
        // * si yo envio el mensaje
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>'+ mensaje.nombre +'</h5>';
        html += '<div class="box bg-light-inverse">'+ mensaje.mensaje +'</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">'+ hora +'</div>';
        html += '</li>';
    } else {
        
        html += '<li class="animated fadeIn">';

        if( mensaje.nombre !== 'Administrador' ) { // si no es el adminstrador no quiero que aparezca ninguna imagen
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html +=     '<h5>'+ mensaje.nombre +'</h5>';
        html +=     '<div class="box bg-light-'+ adminClass +'">'+ mensaje.mensaje +'</div>';
        html += '</div>';
        html += '<div class="chat-time">'+ hora +'</div>';
        html += '</li>';
    }

    // * agregar mensaje que acabo de crear

    divChatBox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatBox.children('li:last-child');

    // heights
    var clientHeight = divChatBox.prop('clientHeight');
    var scrollTop = divChatBox.prop('scrollTop');
    var scrollHeight = divChatBox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatBox.scrollTop(scrollHeight);
    }
}


// Listeners

divUsuarios.on('click', 'a', function() {

    var id = $(this).data('id');

    if(id) { // si existe el id, realiza este console.log
        console.log(id);
    }
});


formEnviar.on('submit', function(e) {

    e.preventDefault(); // evitamos que se recargue la app al dar click en el submit
    // val nos retorna el valor actual que se esta escribiendo
    if(txtMensaje.val().trim().length === 0){
        return; // si es igual a 0, simplemente no hagas nada
    } // trim quita espacios adelante y al final


    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus(); // con el .focus, el cursos se queda ahi aunque toquemos el boton
        renderizarMensajes(mensaje, true);
        // el true es de que yo envie el mensaje, el false de lo que mando otra persona esta en socket-chat
        scrollBottom();
    });

});