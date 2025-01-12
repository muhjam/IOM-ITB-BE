const { Router } = require('express');
const {
  GetDonationById,
  GetDonationByEmail,
  GetAllDonations,
  CreateNewDonation,
  UpdateDonationById,
  DeleteDonationById,
} = require('../controllers/donations');
const upload  = require('../middlewares/multer');

const router = Router();

router.get('', [], GetAllDonations);
router.get('/admin', [], GetAllDonations);
router.get('/:id', [], GetDonationById);
router.post('', upload.fields([{ name: 'proof', maxCount: 1 }]), CreateNewDonation);
router.put('/:id', upload.fields([{ name: 'proof', maxCount: 1 }]), UpdateDonationById);
router.delete('/:id', [], DeleteDonationById);

module.exports = router;
