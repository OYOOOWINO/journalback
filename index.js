"use strict";

const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require('cors')
const http = require("http")
let cron = require('node-cron');

const app = express()
app.use(cors())
const server = http.createServer(app)
const serverPort = 5000

const userRoutes = require("./Routes/User");
const journalRoutes = require("./Routes/Journal");
const feedRoutes = require("./Routes/Feed");
const {feedsService} = require("./Controllers/RandomShare");
dotenv.config()

async function dbConnection() {
    mongoose.set('useFindAndModify', false);
    await mongoose.connect(process.env.DB_URL, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
}

dbConnection().then(res => {
    console.log("DB_CONN_OK")
}).catch(err => console.log(err));

cron.schedule('0 0 12 * *', async () => {
    await feedsService();
  });
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use("/auth", userRoutes)
app.use("/journal", journalRoutes)
app.use("/feed", feedRoutes)

//start the web server
server.listen(process.env.PORT || serverPort, function () {
    //insert logging utitlity
})
