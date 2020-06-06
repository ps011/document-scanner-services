const express = require('express');
const router = express.Router();
const doc = require('../schemas/doc.schema');
const passport = require('../utils/auth-strategies');

router.post('/create', async (req, res) => {
    try {
        const result = await doc.create({
            name: req.body.name,
            user: req.body.user,
            url: req.body.url,
            tags: req.body.tags,
            category: req.body.category,
            size: req.body.size,
            format: req.body.size
        });
        res.status(200).send(result);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.get('/:id', passport.authenticate('jwt'), async (req, res) => {
    try {
        const result = await doc.findById(req.params.id);
        res.status(200).send(result);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.get('/user/:id', passport.authenticate('jwt'), async (req, res) => {
    try {
        const result = await doc.find({ user: req.params.id });
        res.status(200).send(result);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.get('/delete/:id', passport.authenticate('jwt'), async (req, res) => {
    try {
        const result = await doc.findByIdAndDelete(req.params.id);
        res.status(200).send(result);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const result = await doc.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).send(result);
    } catch (e) {
        res.status(404).send(e)
    }
});

module.exports = router;
