import Joi from "joi";
import RoleModel from "./role-model";
import { ValidationError } from "./error-models";

class UserModel {

    public id: number;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public roleId: RoleModel;

    public constructor(user: UserModel) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
        this.roleId = user.roleId;
    }

    // Validation schema - build once:
    private static validationSchema = Joi.object({
        id: Joi.number().optional().integer().positive(),
        firstName: Joi.string().required().min(2).max(20),
        lastName: Joi.string().required().min(2).max(25),
        username: Joi.string().required().alphanum().min(5).max(16),
        password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9!@#$&()-`.+,/\"]{3,30}$')),
        roleId: Joi.number().optional().min(1).max(2)
    });

    public validate(): void {
        const result = UserModel.validationSchema.validate(this);
        if(result.error?.message) throw new ValidationError(result.error.message);
    }
}

export default UserModel;