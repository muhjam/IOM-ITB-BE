const { Router } = require('express');
const {
  GetActivityBySlug,
  GetAllActivities,
  CreateNewActivity,
  UpdateActivityById,
  DeleteActivityById,
} = require('../controllers/activities');
 const JWTValidation = require('../middlewares/auth');

const router = Router();

router.get('', [], GetAllActivities);
router.get('/:slug', [], GetActivityBySlug);
router.post('', JWTValidation, CreateNewActivity);
router.put('/:id', JWTValidation, UpdateActivityById);
router.delete('/:id', JWTValidation, DeleteActivityById);

module.exports = router;
