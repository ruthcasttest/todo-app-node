import { UserRepositoryPort } from "../../domain/ports/user.repository.port";
import { CheckUserResponse, CreateUserDto, User } from "../../domain/models/user.model";

export class UserService {
    constructor(private readonly userRepository: UserRepositoryPort) {}

    async checkUserExists(email: string): Promise<CheckUserResponse> {
        if (!email || !this.isValidEmail(email)) {
            throw new Error("Invalid email format");
        }

        return await this.userRepository.checkUserExists(email);
    }

    async createUser(dto: CreateUserDto): Promise<User> {
        if (!dto.email || !this.isValidEmail(dto.email)) {
            throw new Error("Invalid email format");
        }

        const existingUser = await this.userRepository.checkUserExists(dto.email);
        if (existingUser.exists) {
            throw new Error("User already exists");
        }

        return await this.userRepository.createUser(dto);
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
