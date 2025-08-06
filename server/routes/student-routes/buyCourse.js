const { buyCourse } = require("../../controllers/student-controller/buyCourse");
const express = require("express");

const router = express.Router();

router.post("/buy-course", buyCourse);

module.exports = router;
