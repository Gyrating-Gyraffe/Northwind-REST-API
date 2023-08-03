import { UploadedFile } from "express-fileupload";
import path from "path";
import { v4 as uuid } from "uuid";
import fsPromises from "fs/promises";


// Save image to disk in a UUID name:
async function saveImage(image: UploadedFile): Promise<string> {

    // If no image was uploaded, return default:
    if (!image) return "no_image_found.png";

    // Get the extension of the image:
    const extension = image.name.substring(image.name.lastIndexOf(".") + 1);

    // Create a new UUID name for the image:
    const fileName = uuid() + "." + extension;

    // Get the absolute path of the image:
    const absolutePath = path.join(__dirname, `../1-assets/images/${fileName}`);

    // Save the image to disk:
    await image.mv(absolutePath);

    // Return the UUID name:
    return fileName;
}

async function updateImage(image: UploadedFile, oldImage: string): Promise<string> {
    // Remove old image:
    await deleteImage(oldImage);

    // Save new image:
    const fileName = await saveImage(image);

    return fileName;
}

async function deleteImage(oldImage: string): Promise<void> {
    try {
        // If there's no old image return:
        if (!oldImage) return;

        // Get absolute path of the old image:
        const absolutePath = path.join(__dirname, `../1-assets/images/${oldImage}`);

        // Remove image:
        await fsPromises.rm(absolutePath);
    }
    catch (err: any) { 
        console.log(err.message);
    }
}

export default {
    saveImage,
    updateImage,
    deleteImage
};