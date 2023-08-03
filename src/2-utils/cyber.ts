import { ForbiddenError, UnauthorizedError } from "../3-models/error-models";
import UserModel from "../3-models/user-model";
import jwt from "jsonwebtoken";

// Token secret key
const tokenSecretKey = "The-Amazing-Full-Stack-Students";

// Create JWT token
function getNewToken(user: UserModel): string {
    // Container for user object inside the token:
    const container = { user };

    // Expiration:
    const options = { expiresIn: "3h" };

    // Create token:
    const token = jwt.sign(container, tokenSecretKey, options);

    // Return token:
    return token;
}

function verifyToken(token: string): any {
    if(!token) throw new UnauthorizedError("Authorization failed");

    try {
        return jwt.verify(token, tokenSecretKey);
    }
    catch (err: any) {
        throw new UnauthorizedError(err.message);
    }
}
function verifyAdmin(token: string) {
    // Verify token and get user from token:
    const container = verifyToken(token) as { user: UserModel };
    const user = container.user;

    // Check if user is admin:
    if(user.roleId !== 1) throw new ForbiddenError("You are not an admin");
}

export default { 
    getNewToken,
    verifyToken,
    verifyAdmin
};