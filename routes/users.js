const express = require('express');
const user = require('../schemas/user.schema');
const router = express.Router();
const passport = require('../utils/auth-strategies');
const jwt = require('jsonwebtoken');


router.post('/login', passport.authenticate('local'), async (req, res) => {
  const token = jwt.sign({username: req.body.username}, process.env.JWT_KEY, {expiresIn: '60m'});
  res.json({token});
});

router.get('/logout', function(req, res) {
  req.logout();
  res.json({logout: true});
});

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
    res.json({loggedIn: true})
});

// Disabling route to get list of all users
// router.get('/', async (req, res) => {
//   try {
//     const result = await user.find({});
//     res.status(200).send(result);
//   } catch (e) {
//     res.status(404).send(e.message);
//   }
// });

router.post('/create', async (req, res) => {
  try {
    const result = await user.create({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      mobile: req.body.mobile,
    });
    res.status(200).send(result);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get('/:id', passport.authenticate('jwt'), async (req, res) => {
  try {
    const result = await user.findById(req.params.id);
    res.status(200).send(result);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get('/delete/:id', passport.authenticate('jwt'), async (req, res) => {
  try {
    const result = await user.findByIdAndDelete(req.params.id);
    res.status(200).send(result);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const result = await user.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).send(result);
  } catch (e) {
    res.status(404).send(e)
  }
});

module.exports = router;
