const { Router } = require('express');
const {
  GetPendataanAnggotaById,
  GetAllPendataanAnggota,
} = require('../controllers/pendataanAnggota');
const upload = require('../middlewares/multer');
const JWTValidation = require('../middlewares/auth');

const router = Router();

router.get('', JWTValidation, GetAllPendataanAnggota);
router.get('/:id', JWTValidation, GetPendataanAnggotaById);

module.exports = router;
