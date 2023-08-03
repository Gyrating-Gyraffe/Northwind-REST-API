import { OkPacket } from "mysql";
import dal from "../2-utils/dal";
import ProductModel from "../3-models/product-model";
import { ResourceNotFound } from "../3-models/error-models";
import appConfig from "../2-utils/app-config";
import imageHelper from "../2-utils/image-helper";

// Get all products:
async function getAllProducts(): Promise<ProductModel[]> {
    // Create sql:
    const sql = `SELECT 
        ProductId AS id,
        ProductName AS name,
        UnitPrice AS price,
        UnitsInStock AS stock,
        CONCAT('${appConfig.domainName}/api/products', ImageName) AS imageUrl
    FROM products`;

    // Get products from database:
    const products = await dal.execute(sql);

    // Return products:
    return products;
}

async function getOneProduct(id: number): Promise<ProductModel> {
    // Create sql:
    const sql = `SELECT 
        ProductId AS id,
        ProductName AS name,
        UnitPrice AS price,
        UnitsInStock AS stock,
        CONCAT('${appConfig.domainName}/api/products', ImageName) AS imageUrl
    FROM products
    WHERE productId = ${id}`;

    // Get products from database:
    const products = await dal.execute(sql);

    // Extract single product:
    const product = products[0];

    // If no product found:
    if (!product) throw new ResourceNotFound(id);

    // Return the product:
    return product;
}

async function addProduct(product: ProductModel): Promise<ProductModel> {
    // Validate: 
    product.validate();

    // Save image:
    const imageName = await imageHelper.saveImage(product.image);

    // Create sql: 
    const sql = `INSERT INTO products(productName, UnitPrice, UnitsInStock, ImageName)
                 VALUES('${product.name}', ${product.price}, ${product.stock}, '${imageName}')`;

    // Execute sql, get back info object:
    const info: OkPacket = await dal.execute(sql);

    // Extract new id, set it back in the given product: 
    product.id = info.insertId;

    // Get image url:
    product.imageUrl = `${appConfig.domainName}/api/products/${imageName}`;

    // Delete image from product:
    delete product.image;

    // Return added product:
    return product;
}

async function updateProduct(product: ProductModel): Promise<ProductModel> {

    // Validate:
    product.validate();

    let sql = "", imageName = "";

    if (product.image) {
        // Get the old image name:
        const oldImage = await getOldImage(product.id);

        // Delete old image:
        imageName = await imageHelper.updateImage(product.image, oldImage);

        // Update sql with Image replacement:
        sql = `UPDATE products SET 
                    ProductName = '${product.name}', 
                    UnitPrice = ${product.price}, 
                    UnitsInStock = ${product.stock},
                    ImageName = '${imageName}'
                WHERE productId = ${product.id}`;
    }                                                                      
    else {
        // Update sql:
        sql = `UPDATE products SET 
                    ProductName = '${product.name}', 
                    UnitPrice = ${product.price}, 
                    UnitsInStock = ${product.stock}
                WHERE productId = ${product.id}`;
    }


    // Execute sql, get back info object:
    const info: OkPacket = await dal.execute(sql);

    // If product doesn't exist:
    if (info.affectedRows === 0) throw new ResourceNotFound(product.id);

    // Get image url:
    product.imageUrl = `${appConfig.domainName}/api/products/${imageName}`;

    // Delete image from product:
    delete product.image;

    // Return updated product:
    return product;
}

async function deleteProduct(id: number): Promise<void> {

    // Get old image name:
    const oldImage = await getOldImage(id);

    // Delete the old image:
    await imageHelper.deleteImage(oldImage);

    // Create sql: 
    const sql = `DELETE FROM products WHERE productId = ${id}`;

    // Execute sql, get back info object:
    const info: OkPacket = await dal.execute(sql);

    // If product doesn't exist:
    if (info.affectedRows === 0) throw new ResourceNotFound(id);
}

// Get image name:
async function getOldImage(id: number): Promise<string> {
    const sql = `SELECT imageName FROM products WHERE productId = ${id}`;
    const products = await dal.execute(sql);
    const product = products[0];
    if(!product) return null;
    const imageName = product.imageName;
    return imageName;
}


export default {
    getAllProducts,
    getOneProduct,
    addProduct,
    updateProduct,
    deleteProduct
};






