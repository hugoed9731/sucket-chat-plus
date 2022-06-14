const { io } = require('../server');
const {Usuarios} = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {


        client.on('entrarChat', (data, callback) => {


            // console.log(data);

            if(!data.nombre || !data.sala) {
                return callback({
                    error: true,
                    msg: 'El nombre/sala es necesario'
                });
            }

            // * conectar a un usuario a una sala
            client.join(data.sala);

            // ya sabemos que tenemos el nombre, entonces agreguemoslo a nuestra clase
            // necesitamos el id del socket eso es client.id
            // el nombre viene de data.nombre
           let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

            // * este es un evento que todas las personas pueden escuchar
            // se dispara cada que una persona entra o sale del chat
            client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));    

            // nos interesa retornar las personas que estan conectadas al chat
            callback(usuarios.getPersonasPorSala(data.sala));

        });


        client.on('crearMensaje', (data) => {

            let persona = usuarios.getPersona(client.id); 

            let mensaje = crearMensaje(persona.nombre, data.mensaje); // esto es una informacion que el cliente me tiene que enviar

            // emitir a todo el mundo este nuevo mensaje
            client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        });

        // ! Problema de duplicidad de usuarios resuelta
        // vamos a ser notificados cuando este cliente se desconecte
    client.on('disconnect', () => {

            let personaBorrada = usuarios.borrarPersona(client.id);

        //    Informar que una persona abandono el chat
            client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));

            client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));    

        });

        // Mensajes privador
    // * funcion del servidor cuando alguien quiera mandar un mensaje privado a alguien
    // lo que va a hacer el servidor es recibir la data
        client.on('mensajePrivado', data => {
            // data debe de contener el id de la persona que yo necesito enviar
            let persona = usuarios.getPersona(client.id); 
            // ya sabemos que persona esta mandando el mensaje / segundo el mensaje que quiero enviar
            client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

            // para enviar mensaje privado solo agregar broadcast.to(data.para) para = id de la persona que recibe
        })
    });

