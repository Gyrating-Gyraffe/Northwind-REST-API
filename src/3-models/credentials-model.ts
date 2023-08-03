import Joi from "joi";
import RoleModel from "./role-model";
import { ValidationError } from "./error-models";

class CredentialsModel {

    public username: string;
    public password: string;

    public constructor(credentials: CredentialsModel) {
        this.username = credentials.username;
        this.password = credentials.password;
    }

    // Validation schema - build once:
    private static validationSchema = Joi.object({
        username: Joi.string().required().alphanum().min(5).max(16),
        password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9!@#$&()-`.+,/\"]{3,30}$'))
    });

    public validate(): void {
        const result = CredentialsModel.validationSchema.validate(this);
        if(result.error?.message) throw new ValidationError(result.error.message);
    }
}

export default CredentialsModel;