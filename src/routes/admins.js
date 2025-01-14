const { Router } = require('express');
const {
  CreateNewAdmin,
} = require('../controllers/admins');

const router = Router();

router.post('', [], CreateNewAdmin);

module.exports = router;
