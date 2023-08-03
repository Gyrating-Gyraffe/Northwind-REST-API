import express from "express";
import appConfig from "./2-utils/app-config";
import verbose from "./4-middleware/verbose";
import productsController from "./6-controllers/products-controller";
import catchAll from "./4-middleware/catch-all";
import doorman from "./4-middleware/doorman";
import routeNotFound from "./4-middleware/route-not-found";
import authController from "./6-controllers/auth-controller";
import expressFileUpload from "express-fileupload";

// Create the server:
const server = express();

// Support request.body as JSON:
server.use(express.json());

// Support file upload:
server.use(expressFileUpload());

// Apply App-level middleware:
server.use(verbose);
//server.use(doorman);

// Route requests to our controllers:
server.use("/api", productsController);
server.use("/api", authController);

server.use("*", routeNotFound);

// Catch all middleware:
server.use(catchAll);

// Run server:
server.listen(appConfig.port, () => {
    console.log("Listening on http://localhost:" + appConfig.port);
});



