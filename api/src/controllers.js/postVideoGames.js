const { Videogame, Genre} = require("../db");

const postGame = async (req, res) => {
    try {

// Extrae los datos del cuerpo de la solicitud (req.body).
        const { name, description, platforms, background_image, released, rating, genres} = req.body;
        console.log('genres de req.body', genres);

// Busca los géneros existentes en la base de datos que coinciden con los proporcionados en la solicitud.
        const existingGenres = await Genre.findAll({where: { name: genres} }); 

// Crea un nuevo juego en la base de datos utilizando el modelo Videogame.
        const createGame = await Videogame.create({
            name,
            description,
            platforms,
            background_image,
            released,
            rating,
        });
        console.log('verificando generos', createGame);

// Asocia los géneros existentes al nuevo juego creado.
        await createGame.addGenres(existingGenres);

// Respuesta al servidor. 
        res.status(201).json(createGame);

// Manejo de errores por consola y servidor.        
    } catch (error) {
        console.log('error al crear el juego por consola', error);
        res.status(400).json({ error: 'Faltan datos en la creacion del videojuego'})
    }
};

module.exports = { postGame };