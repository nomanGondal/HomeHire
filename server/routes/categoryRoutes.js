const express = require("express");
const router = express.Router();
const { getCategories } = require("../controllers/categorycontroller");

router.get("/", getCategories); // public — no auth needed

module.exports = router;