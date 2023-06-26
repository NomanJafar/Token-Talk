 const express = require('express')
 const {PORT} = require("./config/index");
 const connectToDB = require('./database/index');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const standardizeResponse = require('./middlewares/standardrizeResponse');
const cookieParser = require('cookie-parser');
const app = express();
connectToDB();

app.use(cookieParser());

app.use(express.json({ limit: "50mb" }));



console.log("entered server js");
app.use(standardizeResponse);
app.use("/storage", express.static("storage"));
app.use(router);
app.use(errorHandler);


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))