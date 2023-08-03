import { OkPacket } from "mysql";
import UserModel from "../3-models/user-model";
import dal from "../2-utils/dal";
import cyber from "../2-utils/cyber";
import { UnauthorizedError, ValidationError } from "../3-models/error-models";
import CredentialsModel from "../3-models/credentials-model";

async function register(user: UserModel): Promise<string> {
    // Validation: 
    user.validate(); 
    
    if(await isUsernameTaken(user.username)) throw new ValidationError("Username already taken");

    // SQL:
    const sql = `INSERT INTO users (firstName, lastName, username, password, roleId) 
        VALUES ('${user.firstName}', 
                '${user.lastName}', 
                '${user.username}', 
                '${user.password}',
                ${user.roleId})`;
        
    // Execute:
    const info: OkPacket = await dal.execute(sql);

    // Set back new id:
    user.id = info.insertId;

    // Get new token:
    const token = cyber.getNewToken(user);

    // Return Token:
    return token;
}

// Login:
async function login(credentials: CredentialsModel): Promise<string> {
    // Validation: 
    credentials.validate();

    // SQL:
    const sql = `SELECT * FROM users WHERE 
                username = '${credentials.username}' AND 
                password = '${credentials.password}'`;

    // Execute:
    const users = await dal.execute(sql);

    // Extract user:
    const user = users[0];

    // If no such user:
    if(!user) throw new UnauthorizedError("Incorrect username or password");

    // Generate token:
    const token = cyber.getNewToken(user);

    return token;
}

// Check if username is taken:
async function isUsernameTaken(username: string): Promise<boolean> {
    const sql = `SELECT * FROM users WHERE username = '${username}'`;

    const usersMatchingName = await dal.execute(sql);

    return usersMatchingName.length > 0;
}

export default { 
    register, 
    login
};