import { ObjectNotFoundException } from "../exception/ObjectNotFoundException";
import { Request, Response, NextFunction, Router } from "express";
import { RestResponse } from "../entity/RestResponse";
import { UserService } from "../service/impl/UserService";
import { User } from "../entity/User";
import logger from "../Logger";
import { MethodNotImplemented } from "../exception/MethodNotImplemented";

// Create the Router().
const user_api = Router();

// Create an instance of the UserService class;
const userService = new UserService();

/**
 * Create a REST API to return all {@link User}. 
 * @Path: [GET] /api/user/
 */
user_api.get("/", async (req: Request<User>, res: Response<RestResponse<User[]>>, next: NextFunction) => {

    logger.debug('Find all users');

    try {

        // TODO:
        // You have to write the code to return all the users obtained by class "UserService" and method "findAll()".

        // --- TIPS: --- //
        // 1) You can use the "userService" variable to find all the users.
        // 2) You can use the "RestResponse" utility class to create an object that conforms to the Swagger documentation. Use the ".ok(...)" method.
        // 3) You have to use the "res" parameter to return a HTTP[s] response with the express framework. 
        
        // Find all users using the UserService class.
        let users = await userService.findAll();

        // Create a RestResponse object.
        let response = RestResponse.ok(users);

        // Return the list of all users.
        return res.json(response);

    } catch (err) {
        next(err);
    }
});

/**
 * Create a REST API to return a {@link User} by email. 
 * @Path: [GET] /api/user/{email}
 */
user_api.get("/:email", async (req: Request, res: Response<RestResponse<any>>, next: NextFunction) => {

    logger.debug('Find user by email "%s"', req.params.email);

    try {

        // Find user by email using the UserService class.
        const user = await userService.findByEmail(req.params.email);

        // Throw a ObjectNotFoundException if the user doesn't exist.
        if (!user)
            throw new ObjectNotFoundException(`The user with email "${req.params.email}" doesn't exist`);

        // Return user object.
        return res.json(RestResponse.ok(user));

    } catch (err) {
        next(err);
    }
});

/**
 * Create a REST API to add a new {@link User}.
 * @Path: [POST] /api/user/
 */
user_api.post("/", async (req: Request, res: Response<RestResponse<any>>, next: NextFunction) => {

    logger.debug('Create a new user with values: \n%o', req.body);

    try {

        // Create a new user using the UserService class.
        await userService.create(req.body);

        // Return the newly created user with status code 201.
        return res.status(201).json(RestResponse.created(req.body));

    } catch (err) {
        next(err);
    }
});

/**
 * Create a REST API to delete a {@link User} by email.
 * @Path: [DELETE] /api/user/{email}
 */
user_api.delete("/:email", async (req: Request, res: Response<RestResponse<any>>, next: NextFunction) => {

    logger.debug('Delete user by email "%s"', req.params.email);

    // Delete a user by email using the UserService class.
    const result = await userService.delete(req.params.email);

    try {

        // Throw a ObjectNotFoundException if the user doesn't exist.
        if (!result)
            throw new ObjectNotFoundException(`The user with the email "${req.params.email}" doesn't exist`);

        // Return the value `The user with the email ${req.params.email} has been deleted` if the user was deleted successfully.
        return res.json(RestResponse.ok(`The user with the email "${req.params.email}" has been deleted`));

    } catch (err) {
        next(err);
    }
});

/**
 * Create a REST API to update the firstname and/or the lastname of a {@link User} by email.
 * @Path: [PATCH] /api/user/{email}
 */
user_api.patch("/:email", async (req: Request, res: Response<RestResponse<any>>, next: NextFunction) => {

    logger.debug('Update user by email "%s"', req.params.email);

    try {
        
        // Get "firstname" query param.
        const firstname = req.query.firstname ? req.query.firstname.toString() : null;

        // Get "lastname" query param.
        const lastname = req.query.lastname ? req.query.lastname.toString() : null;

        // Update a user by email using the UserService class.
        const result = await userService.update(req.params.email, firstname, lastname);

        // Throw a ObjectNotFoundException if the user doesn't exist.
        if (!result)
            throw new ObjectNotFoundException(`The user with the email "${req.params.email}" doesn't exist`);

        logger.debug('New user values are %o', result);

        // Return the user with the updated fields.
        return res.json(RestResponse.ok(result));

    } catch (err) {
        next(err);
    }
});

export default user_api;