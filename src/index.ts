import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
import { PORT } from './config';
import withSeeds from './seed'
import initStrategies from "./initStrategies";
const passport = require('passport');

createConnection().then(async connection => {
    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    initStrategies();
    app.use("/api", routes);

    app.listen(PORT);

    await withSeeds(connection);
    console.log(`Server has started on port ${PORT}.\n`);

}).catch(error => console.log(error));
