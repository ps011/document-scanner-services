const express = require('express');
const router = express.Router();
const doc = require('../schemas/doc.schema');
const passport = require('../utils/auth-strategies');

// create a new document against a user
router.post('/create', async (req, res) => {
    try {
        const result = await doc.create({
            name: req.body.name,
            user: req.body.user,
            url: req.body.url,
            tags: req.body.tags,
            category: req.body.category,
            size: req.body.size,
            format: req.body.format
        });
        res.status(200).send(result);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

// fetch a document using ID
router.get('/:id', passport.authenticate('jwt'), async (req, res) => {
    try {
        const result = await doc.findById(req.params.id);
        res.status(200).send(result);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

// fetch all the docs of a giver user
router.get('/user/:id', passport.authenticate('jwt'), async (req, res) => {
    try {
        const result = await doc.find({ user: req.params.id });
        res.status(200).send(result);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

// delete a doc by ID
router.get('/delete/:id', passport.authenticate('jwt'), async (req, res) => {
    try {
        const result = await doc.findByIdAndDelete(req.params.id);
        res.status(200).send(result);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

// update metadata of a doc by ID
router.put('/update/:id', async (req, res) => {
    try {
        const result = await doc.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).send(result);
    } catch (e) {
        res.status(404).send(e)
    }
});

module.exports = router;
