const { Videogame, Genre} = require("../db");
const axios = require("axios");

const getVideoGameId = async (req, res) => {
    try {
      
        const { idVideogame } = req.params;
        console.log(idVideogame); 

// Determina si el ID es un número o un UUID.
        let types = 'number';
        if(isNaN(idVideogame)) {
            types = 'uuid'
        };

// Si el ID es un número, realiza una solicitud a la API para obtener los detalles del juego.
        if (types === 'number') {
            const url = `https://api.rawg.io/api/games/${idVideogame}?key=59bd5ab338444f1ab46b4f57debf9c41`;
            const { data } = await axios(`${url}`);
            console.log(data); 

// Si no se encuentra un juego con el ID en la API, responde con un estado 404 y un mensaje.
            if (!data.name) {
            return res.status(404).send('No se encontro un juego con el id seleccionado en la API');
            }

// Crea un objeto con los detalles del juego obtenidos de la API.
            const Apigame = {
                id: data.id,
                name: data.name,
                description: data.description,
                platform: data.platform?.map((platf)=>{return platf.platform.name}) || [],
                background_image: data.background_image,
                released: data.released,
                rating: data.rating,
                genres: data.genres.map((genr)=> {return genr.name}),
            }
 // Responde con los detalles del juego obtenidos de la API.
            return res.status(200).json(Apigame);
        } 
// Si el ID es un UUID, busca el juego en la base de datos.
        else {
            const DBgame = await Videogame.findByPk(idVideogame, {
                include: {
                    model: Genre,
                    attributes: ['id', 'name'],
                    through: {
                        attributes: []
                    },
                    order: [ ['ASC'] ],
                },
            });

// Si se encuentra el juego en la base de datos, construye un objeto con sus detalles.
            if (DBgame) {
                const genres = (DBgame.genres || []).map((genr) => {return genr.name});

                const gameData = {
                    id: DBgame.id,
                    name: DBgame.name,
                    description: DBgame.description,
                    platforms: DBgame.platforms,
                    background_image: DBgame.background_image,
                    released: DBgame.released,
                    rating: DBgame.rating,
                    genres: genres,
                };
// Responde con los detalles del juego obtenidos de la base de datos.
             return res.status(200).json(gameData);
            } 
// Si no se encuentra el juego en la base de datos, envia una respuesta al servidor.            
            else {
                return res.status(404).send('No se encontró un juego con el ID seleccionado en la base de datos');
            }
        }

// Manejo de errores. 
    } catch (error) {
        console.log('Error al buscar juego por id', error)
        return res.status(400).json({error:'No se encontro juego con el ID solicitado'})
    }
};

module.exports = { getVideoGameId };