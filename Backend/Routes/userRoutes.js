const express = require("express");
const userAuth = require("../middleware/userAuth");
const { getuserData } = require("../Controller/userController");

const router = express.Router();
router.get('/data',userAuth,getuserData);
module.exports = router;