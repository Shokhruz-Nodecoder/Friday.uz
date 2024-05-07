const express = require("express")
const app = express()


require("./start/swagger")(app)
require("./start/module")(app)
require("./start/run")(app)