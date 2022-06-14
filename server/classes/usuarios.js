


class Usuarios {
    
    constructor() {
        // inicializar un arreglo de personas que esta conectada al chat
        this.personas = [];
    }

    agregarPersona(id, nombre, sala){

        let persona = { id, nombre, sala }; // estos valores van a ser iguales a los valores que estoy resiviendo

        // agregar a esta persona que es el let, al arreglo vacio de arriba
        this.personas.push(persona);

        return this.personas; // todas las personas que estan en el chat

    }

    // * obtener información de la persona

    getPersona(id) {
        // buscar en el arreglo de personas si alguien coicide con este id
        // filter regresa un nuevo arreglo
        let persona = this.personas.filter(persona =>  persona.id === id)[0];
         // filter regresa un nuevo arreglo por lo cual necesitamos las primera posicion
        
        //  ! si no encuentra una persona por el id esto va a ser undefined
        return persona; // si encuntra persona tendra un objeto, si no obtendra un null
    }

    getPersonas(){
        return this.personas;
    }

    getPersonasPorSala(sala){
        let personasEnSala = this.personas.filter(persona =>  persona.sala === sala);
        return personasEnSala;
    }


    borrarPersona(id) {
        // obtenemos persona antes de sacarla del arreglo
        let personaBorrada = this.getPersona(id);

        // remplazamos el arreglo actual de las personas que tenga
       this.personas = this.personas.filter(persona => persona.id != id); // persona id sea diferente al id que me estan enviando)

        // la función de arriba regresa un nuevo arreglo, lo guardamos en this.personas

        return personaBorrada; // obtenemos referencia cuando borremos dicha persona
    }

}



module.exports = {
    Usuarios 
}