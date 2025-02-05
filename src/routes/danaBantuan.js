const { Router } = require('express');
const {
  GetDanaBantuanById,
  GetAllDanaBantuan,
  CreateNewDanaBantuan,
  UpdateDanaBantuanById,
  DeleteDanaBantuanById,
} = require('../controllers/danaBantuan');
const JWTValidation = require('../middlewares/auth')

const router = Router();

router.get('', JWTValidation, GetAllDanaBantuan);
router.get('/:id', [], GetDanaBantuanById);
router.post('', JWTValidation, CreateNewDanaBantuan);
router.put('/:id', JWTValidation, UpdateDanaBantuanById);
router.delete('/:id', JWTValidation, DeleteDanaBantuanById);

module.exports = router;
