import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import { Request, Response } from "express";
import routes from "./routes";
import { PORT } from './config';
import withSeeds from './seed'
import withAuth from "./auth";

createConnection().then(async connection => {
    const app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    app.use("/", routes);
    withAuth(app);

    app.listen(PORT);

    await withSeeds(connection);
    console.log(`Server has started on port ${PORT}.\n`);

}).catch(error => console.log(error));
