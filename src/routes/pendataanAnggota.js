const { Router } = require('express');
const {
  GetPendataanAnggotaById,
  GetAllPendataanAnggota,
} = require('../controllers/pendataanAnggota');
const upload = require('../middlewares/multer');

const router = Router();

router.get('', [], GetAllPendataanAnggota);
router.get('/:id', [], GetPendataanAnggotaById);

module.exports = router;
