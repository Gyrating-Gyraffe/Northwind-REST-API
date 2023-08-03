import express, { Request, Response, NextFunction } from "express";
import productsService from "../5-services/products-service";
import StatusCode from "../3-models/status-code";
import ProductModel from "../3-models/product-model";
import verifyToken from "../4-middleware/verify-token";
import verifyAdmin from "../4-middleware/verify-admin";
import path from "path";

// Create the router part of express:
const router = express.Router();

// GET http://localhost:4000/api/products
router.get("/products", async (request: Request, response: Response, next: NextFunction) => {

    try {
        // Get all products from database:
        const products = await productsService.getAllProducts();

        // Respond back with all products:
        response.json(products);
    }
    catch (err: any) {
        next(err);
    }
});

// GET http://localhost:4000/api/products/{id: number}
router.get("/products/:id([0-9]+)", async (request: Request, response: Response, next: NextFunction) => {
    // Get route id:
    const id = +request.params.id;
    try {
        // Get a product from database:
        const product = await productsService.getOneProduct(id);

        // Respond back with all products:
        response.json(product);
    }
    catch (err: any) {
        next(err);
    }
});

// GET http://localhost:4000/api/products/imageName
router.get("/products/:imageName", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get image name:
        const imageName = request.params.imageName;

        // Get image absolute path:
        const absolutePath = path.join(__dirname, `../1-assets/images/${imageName}`);

        // Respond back with image file:
        response.sendFile(absolutePath);
    }
    catch (err: any) {
        next(err);
    }
});

// POST http://localhost:4000/api/products
router.post("/products", verifyToken, async (request: Request, response: Response, next: NextFunction) => {

    // Add image from request.files to request.body:
    request.body.image = request.files?.image;

    // Get the product sent from frontend:
    const product = new ProductModel(request.body);
    
    try {
        // Add product to database:
        const addedProduct = await productsService.addProduct(product);

        // Respond back with desired product:
        response.status(StatusCode.Created).json(addedProduct);
    }
    catch (err: any) {
        next(err);
    }
});

// PUT http://localhost:4000/api/products
router.put("/products/:id", verifyToken, async (request: Request, response: Response, next: NextFunction) => {
    // Overwrite body ID with params ID:
    request.body.id = +request.params.id;

    // Add image from request.files to request.body:
    request.body.image = request.files?.image;

    // Get product sent from frontend:
    const product = new ProductModel(request.body);
    try {
        // Update product in database:
        const updatedProduct = await productsService.updateProduct(product);

        // Respond back with desired product:
        response.json(updatedProduct);
    }
    catch (err: any) {
        next(err);
    }
});

// DELETE http://localhost:4000/api/products
router.delete("/products/:id", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    // Get route id:
    const id = +request.params.id;
    try {
        // Delete the product:
        await productsService.deleteProduct(id);

        // Deleted successfully: 
        response.sendStatus(StatusCode.NoContent);
    }
    catch (err: any) {
        next(err);
    }
});

// Export the above router:
export default router;