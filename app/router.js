var express = require("express");
const User = require("./models/User.model.js");
const Card = require("./models/Card.model.js");
const router = express.Router();

router.get('/registered', (req, res) => {
    (async function () {
        const currentUser = await User.findOne({
            where: {
                AccessToken: 'TESTACTKN1'
            }
        });
        const cards = await Card.findAll({
            where: {
                OwnerUser: currentUser.id
            }
        })
        const rescards = cards.map(c => ({
                master: c.Master,
                point: c.Point
            }));
        res.json(rescards);
    })();
});

module.exports = router;