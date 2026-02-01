import { CheckUserResponse, CreateUserDto, User } from "../models/user.model";

export interface UserRepositoryPort {
    checkUserExists(email: string): Promise<CheckUserResponse>;
    createUser(dto: CreateUserDto): Promise<User>;
    findById(id: string): Promise<User | null>;
}
