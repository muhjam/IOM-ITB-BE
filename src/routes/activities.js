const { Router } = require('express');
const {
  GetActivityById,
  GetAllActivities,
  CreateNewActivity,
  UpdateActivityById,
  DeleteActivityById,
} = require('../controllers/activities');
const upload  = require('../middlewares/multer');

const router = Router();

router.get('', [], GetAllActivities);
router.get('/:id', [], GetActivityById);
router.post('', [], CreateNewActivity);
router.put('/:id', [], UpdateActivityById);
router.delete('/:id', [], DeleteActivityById);

module.exports = router;
