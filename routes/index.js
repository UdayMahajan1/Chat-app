const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile('/index.html');
});

router.post('/', (req, res) => {
    const roomName = req.body.roomName;
    // console.log(roomName);
    res.render('chat', { roomName: roomName });
});

router.post('/logOut', (req,res) => {
    res.redirect('/');
});

module.exports = router;