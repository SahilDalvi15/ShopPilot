const router = require('express').Router();
const cryptoController = require('../controllers/crypto.controller');

// This route does not strictly need to be protected, but to prevent abuse, 
// it's a good idea to put it behind auth if only users checking out need it.
// For now, we will leave it unprotected to allow easy fetching, or you could add protect.
router.get('/rates', cryptoController.getCryptoRates);

module.exports = router;
