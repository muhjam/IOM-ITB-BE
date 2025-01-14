const express = require('express');

const router = express.Router();
const AuthRouter = require('./auth');
const UserRouter = require('./users');
const MemberRouter = require('./members');
const AdminRouter = require('./admins');
const MerchandiseRouter = require('./merchandises');
const ActivityRouter = require('./activities');
const DonationsRouter = require('./donations');
const HelpSubmissiosRouter = require('./helpSubmissions');
const TransactionRouter = require('./transactions');
const fileRouter = require('./file');
const CompetitionRouter = require('./competition');

router.get('/', (req, res) => {
  res.json({
    version: '3.9.0',
  });
});

router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/members', MemberRouter);
router.use('/admins', AdminRouter);
router.use('/merchandises', MerchandiseRouter);
router.use('/activities', ActivityRouter);
router.use('/donations', DonationsRouter);
router.use('/help-submissions', HelpSubmissiosRouter);
router.use('/transactions', TransactionRouter);
router.use('/file', fileRouter);
router.use('/competition', CompetitionRouter);

module.exports = router;
