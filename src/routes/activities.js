const { Router } = require('express');
const {
  GetActivityById,
  GetAllActivities,
  CreateNewActivity,
  UpdateActivityById,
  DeleteActivityById,
} = require('../controllers/activities');
 const JWTValidation = require('../middlewares/auth');

const router = Router();

router.get('', [], GetAllActivities);
router.get('/:id', [], GetActivityById);
router.post('', JWTValidation, CreateNewActivity);
router.put('/:id', JWTValidation, UpdateActivityById);
router.delete('/:id', JWTValidation, DeleteActivityById);

module.exports = router;
