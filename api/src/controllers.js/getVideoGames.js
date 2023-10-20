const axios = require("axios");
const { Videogame, Genre } = require("../db");

const getVideoGame = async (req, res) => {
    try {

// La promesa se resulve y contendra la info de los videosjuegos con sus generos, recuperados de la base de datos.        
       const limit = 20;

       const pages = [1, 2, 3, 4, 5];
       const videogamesPromises = Videogame.findAll({
        include: {
            model: Genre,
            attributes: ['name'],
            through: { attributes: [] },
            order: [ ['ASC'] ],
        },
       });
// Obtiene un array de promesas, cada promesa es una solicitud a la API, se resuelven todas y se obtiene la info de los videojuegos de la API.
       const ApiPromises = pages.map(page =>
            axios.get(`https://api.rawg.io/api/games?key=59bd5ab338444f1ab46b4f57debf9c41&page=${page}&page_size=${limit}`)
        );
// allData contiene los resultados combinados de las consultas a las bd y a la API. 
        const allData = await Promise.all([videogamesPromises, ...ApiPromises]);

        const videogamesDB = allData[0];
        const Apivideogames = allData.slice(1);
// Se crea un nuevo array, donde cada elemento es un objeto que representa un juego y un nuevo campo genres que contiene un array con los nombres de los generos. 
        const genresDB = videogamesDB.map((game) => ({
            ...game.toJSON(),
            genres: game.genres?.map((genre) => genre.name) || [],
        })); 
// Se crea un nuevo array, donde cada elemento representa un juego obtenido de la API.
        const allApiVideoGames = Apivideogames.flatMap(({ data: { results }}) => 
          results.map((game) => ({
            id: game.id,
            name: game.name,
            description: game?.description || "No Description",
            platforms: game.platforms?.map((platform) => platform.platform.name) || "No platform",
            background_image: game.background_image,
            released: game.released,
            rating: game.rating,
            genres: game.genres?.map((genre) => genre.name) || "No Genre", 
          }))
        ); 
// Se crea un array que contiene la combinacion de los juegos obtenidos de la API y la BD. Luego, se envia como respuesta al cliente que realizo la solicitud. 
        const allVideogames = [
            ...genresDB,
            ...allApiVideoGames,
        ];

        return res.send(allVideogames);
// Manejo de errores por consola y servidor.
    } catch (error) {
        console.error("Error en la ruta /videogames", error);
        res.status(400).json({ error: error.message});
    }
};

module.exports = { getVideoGame };