// Importar todos los routers;
const { Router } = require('express');
const { getVideoGame } = require("../controllers.js/getVideoGames");
const { getVideoGameName } = require("../controllers.js/getVideoGamesName");
const { getVideoGameId } = require("../controllers.js/getVideoGamesID");
const { getGenre } = require("../controllers.js/getGenres");
const { postGame } = require("../controllers.js/postVideoGames");

const router = Router();

// Configurar los routers
router.get('/videogames', getVideoGame);
router.get('/videogames/name', getVideoGameName);
router.get('/videogames/:idVideogame', getVideoGameId); 
router.get('/genres', getGenre);
router.post('/videogames', postGame);

module.exports = router;
