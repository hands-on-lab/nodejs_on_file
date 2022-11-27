
import express, { Application, NextFunction, Request, Response } from 'express';
import { ObjectNotFoundException } from './exception/ObjectNotFoundException';
import { MethodNotImplemented } from './exception/MethodNotImplemented';
import { MandatoryException } from './exception/MandatoryException';
import { DuplicateException } from './exception/DuplicateException';
import { RestResponse } from './entity/RestResponse';
import swaggerUi from 'swagger-ui-express';
import user_api from './route/UserRoute';
import logger from './Logger';
import YAML from 'yamljs';

// Define external port for the express server.
const port: number = 1339;

// Create Express instance.
const app: Application = express();

// Set Express to parse body requests as JSON.
app.use(express.json());

// Expose the User Route.
app.use("/api/user", user_api);

// Set Express exception handler.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    logger.error(err);

    switch(true) {

        case err instanceof SyntaxError:
        case err instanceof MandatoryException:
            return res.status(400).json(RestResponse.badRequest(err.message));

        case err instanceof ObjectNotFoundException:
            return res.status(404).json(RestResponse.notFound(err.message))

        case err instanceof DuplicateException:
            return res.status(409).json(RestResponse.conflict(err.message));

        case err instanceof MethodNotImplemented:
                return res.status(501).json(RestResponse.notImplemented("Method not implemented"));
            
        default:
            return res.status(500).json(RestResponse.internalServerError("Generic error, see the log for more details"));
    }
});

// Running express server.
app.listen(port, () => {
    logger.info("Server running at %d", port);
});

// ------------------ Expose the Swagger Route ------------------ //
app.use('/', swaggerUi.serve, swaggerUi.setup(YAML.load('./swagger.yaml')));
// -------------------------------------------------------------- //