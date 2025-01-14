const { Router } = require('express');
const {
  LoginAdmin,
  GetDataAdmin
} = require('../controllers/admins');
const router = Router();
const JWTValidation = require('../middlewares/auth')

router.post('/login', [], LoginAdmin);
router.get('/me', JWTValidation, GetDataAdmin);

module.exports = router;
