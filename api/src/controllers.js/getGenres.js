const { Genre } = require("../db");
const axios = require("axios");

const getGenre = async (req, res) => {
    try {

// Obtiene todos los géneros de la base de datos.
        let DBgenres = await Genre.findAll();
        console.log('generos de la base de datos', DBgenres);

// Si no hay géneros en la base de datos, realiza una solicitud a la API para obtenerlos y luego los guarda en la base de datos.
        if(!DBgenres.length) {
            const APIgenres = await axios.get("https://api.rawg.io/api/genres?key=59bd5ab338444f1ab46b4f57debf9c41");
            DBgenres = await Genre.bulkCreate(APIgenres.data.results);
        }

// Responde con la lista de géneros.         
        res.send(DBgenres);

// Manejo de errores. 
    } catch (error) {
        res.status(400).json({error: 'No hay generos'});
        console.log('No se encontro el genero', error);
    }
};

module.exports = { getGenre };