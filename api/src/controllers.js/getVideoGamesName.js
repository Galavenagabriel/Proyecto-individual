const { Videogame, Genre} = require("../db");
const axios = require("axios");
// Importa el operador de sequelize (Op) para realizar consultas case-insensitive.
const { Op } = require("sequelize");

const getVideoGameName = async (req, res) => {
    try {
        const { name } = req.query;
        const nameMinMay = name.toLowerCase();

// Busca videojuegos en la base de datos que coincidan con el nombre.
        const BDvideogames = await Videogame.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${nameMinMay}%`
                }
            },
            include: Genre,
        });

// Si se encuentran videojuegos en la base de datos, los envía como respuesta al servidor.        
        if(BDvideogames.length) {
            res.send(BDvideogames);
            return;
        }

// Si no se encuentran videojuegos en la base de datos, realiza una solicitud a la API para buscarlos.
        const page = 15;
        const APIvideogames = await axios.get(
            `https://api.rawg.io/api/games?search={game}${name}&key=59bd5ab338444f1ab46b4f57debf9c41&page_size=${page}`,
            {
                params: {
                    search: name,
                }
            }
        );

// Obtiene los resultados de la API.        
        const apiResults = APIvideogames.data.results;

// Si no hay resultados en la API, responde con un mensaje indicando que no se encontraron videojuegos.       
        if(apiResults.length === 0) {
            res.status(200).json({ message: "No se encontraron videojuegos con el nombre solicitado"})            
// Si no hay resultados en la API, responde con un mensaje indicando que no se encontraron videojuegos.       
        } else {
            res.status(200).send(apiResults);
        }

// Manejo de errores. 
    } catch (error) {
        console.log("No se encontraron videojuegos con el nombre solicitado", error)
        res.status(400).json({ error: 'Error interno del servidor'})        
    }
};

module.exports = { getVideoGameName };