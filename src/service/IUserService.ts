import { User } from "../entity/User";

/**
 * Service interface that defines operations to manage users.
 */
export interface IUserService {

    /**
     * Create a new {@link User}.
     * @param user {@link User}.
     * @throws {MandatoryException} If a mandatory parameter is null or empty.
     * @throws {DuplicateException} If the user already exist.
     */
    create(user: User): Promise<void>;

     /**
     * Return all the {@link User}s.
     * @returns Array of {@link User}.
     */
    findAll(): Promise<User[]>;

    /**
     * Find a {@link User} by email.
     * @param email Filter used to search the {@link User}.
     * @throws {MandatoryException} If a mandatory parameter is null or empty.
     * @returns The {@link User} if exist, null otherwise.
     */
    findByEmail(email: string): Promise<User>;

    /**
     * Delete a {@link User} by email.
     * @param email Filter used to search the {@link User}.
     * @throws {MandatoryException} If a mandatory parameter is null or empty.
     * @returns True if the user will be removed from the array, false otherwise.
     */
    delete(email: string): Promise<boolean>;

    /**
     * Update {@link User}'s fields by email.
     * @param email Filter used to search the {@link User}.
     * @param firstname Value to update.
     * @param lastname Value to update.
     * @throws {MandatoryException} If a mandatory parameter is null or empty.
     * @returns {@link User} with new values if it exists, null otherwise.
     */
    update(email: string, firstname?: string, lastname?: string): Promise<User>;
}