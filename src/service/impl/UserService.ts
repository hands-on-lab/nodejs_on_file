import path from "path/posix";
import * as fs from "fs/promises";
import { User } from "../../entity/User";
import { IUserService } from "../IUserService";
import { DuplicateException } from "../../exception/DuplicateException";
import { MandatoryException } from "../../exception/MandatoryException";

export class UserService implements IUserService {

    // String variable to store the file path of the users.json file.
    private filepath: string;

    constructor() {

        // Resolve the path "./users.json".
        this.filepath = path.resolve("./users.json");

        // Check if the users.json file exist and its content is a json.
        // NOTE: If the file doesn't exist or if its content isn't a json, create an empty array.
        fs.readFile(this.filepath, "utf8")
            .then(value => JSON.parse(value))
            .catch(() => fs.writeFile(this.filepath, "[]"));
    }

    public async create(user: User): Promise<void> {

        // Check if object is null.
        if (!user)
            throw new MandatoryException("The object user is mandatory");

        // Check if the "firstname" parameter is null or empty.
        if (!user.firstname || user.firstname.trim().length == 0)
            throw new MandatoryException("The parameter .firstname is mandatory");

        // Check if the "lastname" parameter is null or empty.
        if (!user.lastname || user.lastname.trim().length == 0)
            throw new MandatoryException("The parameter .lastname is mandatory");

        // Check if the "email" parameter is null or empty.
        if (!user.email || user.email.trim().length == 0)
            throw new MandatoryException("The parameter .email is mandatory");

        // Get users from file.
        let users = JSON.parse(await fs.readFile(this.filepath, "utf8"));

        // Check if the user to add already exist.
        if (users.find((u: User) => u.email === user.email ? true : false))
            throw new DuplicateException(`The user with email "${user.email}" already exist`);

        // Add new user.    
        users.push(user);
        await fs.writeFile(this.filepath, JSON.stringify(users));
    }

    public async findAll(): Promise<User[]> {

        // TODO:
        // You have to write the code to return all the users in the "users.json" file

        // --- TIPS: --- //
        // 1) You have to use the "fs" module (already imported) to read the "users.json" file. 
        // 2) The path of the file to read is stored in the variable "this.filepath" and the encoding value is "utf8" 
        // 3) The JSON module can help you to parse the a "string" value to a object!!!!

        // Get content from file.
        let content = await fs.readFile(this.filepath, "utf8");
        
        // Parse the content of the file as Json.
        let users = JSON.parse(content);

        // Return the json value.
        return users;
    }

    public async findByEmail(email: string): Promise<User> {

        // Check if the "email" parameter is null or empty.
        if (!email || email.trim().length == 0)
            throw new MandatoryException("The parameter email is mandatory");

        // Get users from file.
        let users = JSON.parse(await fs.readFile(this.filepath, "utf8"));

        // Find and return the user by email [CASE INSENSITIVE].
        return users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    }

    public async delete(email: string): Promise<boolean> {

        // Check if the "email" parameter is null or empty.
        if (!email || email.trim().length == 0)
            throw new MandatoryException("The parameter email is mandatory");

        // Get users from file.
        let users = JSON.parse(await fs.readFile(this.filepath, "utf8"));

        // Find the index of the element to remove.
        const index = users.findIndex((u: User) => u.email === email);

        // If the user exist in the array, then remove it.
        if (index != -1) {

            // Remove the element.
            users.splice(index, 1);

            // Re-write the file.
            await fs.writeFile(this.filepath, JSON.stringify(users));

            // Return true.
            return true;
        }

        // Return false.
        return false;
    }

    public async update(email: string, firstname?: string, lastname?: string): Promise<User> {

        // Check if the "email" parameter is null or empty.
        if (!email || email.trim().length == 0)
            throw new MandatoryException("The parameter email is mandatory");

        // Check if at least one of the "firstname" or "lastname" parameters is not null or empty. 
        if ((!firstname || firstname.trim().length == 0) && (!lastname || lastname.trim().length == 0))
            throw new MandatoryException('At least one of the "firstname" or "lastname" parameters must not be null');

        // Get users from file.
        let users = JSON.parse(await fs.readFile(this.filepath, "utf8"));

        // Find the user to update by email.
        const index = users.findIndex((u: User) => u.email === email);
        const user = users[index];

        // Check if the user to update exists.
        if (!user)
            return null;

        // Update the "firstname" if not null.
        if (firstname)
            user.firstname = firstname;

        // Update the "lastname" if not null.
        if (lastname)
            user.lastname = lastname;

        // Update the array with the modified user.
        users[index] = user;

        // Re-write the file.
        await fs.writeFile(this.filepath, JSON.stringify(users));

        // Return the user with the new values.
        return user;
    }
}