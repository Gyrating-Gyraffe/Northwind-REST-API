import mysql from "mysql";
import appConfig from "./app-config";

// Create a connection to the database:
const connection = mysql.createPool({
    host: appConfig.mysqlHost,
    user: appConfig.mysqlUser,
    password: appConfig.mysqlPassword,
    database: appConfig.mysqlDatabase
});

// Execute SQL in the database:
function execute(sql: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

export default {
    execute
};