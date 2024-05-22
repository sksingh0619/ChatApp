const express = require("express");
const {registerUser, loginUser, findUser, getAllUsers} = require("../Controller/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/users",getAllUsers);

module.exports = router;