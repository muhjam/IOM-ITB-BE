const { Router } = require('express');
const {
  GetExcelById,
  GetAllExcel,
} = require('../controllers/excel');
const JWTValidation = require('../middlewares/auth');

const router = Router();

const token = "53ByQJ3YHNPUQ3IKGw8GO"

router.get('', JWTValidation, (req, res, next) => {
  GetAllExcel(req, res, next, token);
});
router.get('/:id', JWTValidation, (req, res, next) => {
  GetExcelById(req, res, next, token);
});

module.exports = router;
