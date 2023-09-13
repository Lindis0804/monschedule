const testController = require("../controllers/testController")


const route = require("express").Router()
route.get("/addComment",testController.addComment)
route.get("/")
module.exports = route