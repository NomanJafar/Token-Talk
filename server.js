 const express = require('express')
 const {PORT} = require("./config/index");
 const connectToDB = require('./database/index');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const standardizeResponse = require('./middlewares/standardrizeResponse');
const cookieParser = require('cookie-parser');
connectToDB();
const app = express();
app.use(cookieParser());

 app.use(express.json({ limit: "50mb" }));


app.use(standardizeResponse);
app.use(router);

app.use(errorHandler);

app.use(router);
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))