import { UserService } from './user.service';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { CheckUserResponse, User } from '../../domain/models/user.model';

describe('UserService', () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<UserRepositoryPort>;

    beforeEach(() => {
        mockUserRepository = {
            checkUserExists: jest.fn(),
            createUser: jest.fn(),
            findById: jest.fn(),
        };
        userService = new UserService(mockUserRepository);
    });

    describe('checkUserExists', () => {
        it('should return user exists response when user exists', async () => {
            const email = 'test@example.com';
            const mockResponse: CheckUserResponse = {
                exists: true,
                user: {
                    id: '123',
                    email,
                    createdAt: new Date(),
                },
            };

            mockUserRepository.checkUserExists.mockResolvedValue(mockResponse);

            const result = await userService.checkUserExists(email);

            expect(result).toEqual(mockResponse);
            expect(mockUserRepository.checkUserExists).toHaveBeenCalledWith(email);
            expect(mockUserRepository.checkUserExists).toHaveBeenCalledTimes(1);
        });

        it('should return user does not exist response when user does not exist', async () => {
            const email = 'nonexistent@example.com';
            const mockResponse: CheckUserResponse = {
                exists: false,
                user: undefined,
            };

            mockUserRepository.checkUserExists.mockResolvedValue(mockResponse);

            const result = await userService.checkUserExists(email);

            expect(result).toEqual(mockResponse);
            expect(result.exists).toBe(false);
            expect(result.user).toBeUndefined();
        });

        it('should throw error when email is empty', async () => {
            await expect(userService.checkUserExists('')).rejects.toThrow('Invalid email format');
            expect(mockUserRepository.checkUserExists).not.toHaveBeenCalled();
        });

        it('should throw error when email format is invalid', async () => {
            await expect(userService.checkUserExists('invalid-email')).rejects.toThrow('Invalid email format');
            await expect(userService.checkUserExists('test@')).rejects.toThrow('Invalid email format');
            await expect(userService.checkUserExists('@example.com')).rejects.toThrow('Invalid email format');
            expect(mockUserRepository.checkUserExists).not.toHaveBeenCalled();
        });
    });

    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            const email = 'newuser@example.com';
            const mockExistsResponse: CheckUserResponse = {
                exists: false,
                user: undefined,
            };
            const mockCreatedUser: User = {
                id: '456',
                email,
                createdAt: new Date(),
            };

            mockUserRepository.checkUserExists.mockResolvedValue(mockExistsResponse);
            mockUserRepository.createUser.mockResolvedValue(mockCreatedUser);

            const result = await userService.createUser({ email });

            expect(result).toEqual(mockCreatedUser);
            expect(mockUserRepository.checkUserExists).toHaveBeenCalledWith(email);
            expect(mockUserRepository.createUser).toHaveBeenCalledWith({ email });
            expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
        });

        it('should throw error when user already exists', async () => {
            const email = 'existing@example.com';
            const mockExistsResponse: CheckUserResponse = {
                exists: true,
                user: {
                    id: '789',
                    email,
                    createdAt: new Date(),
                },
            };

            mockUserRepository.checkUserExists.mockResolvedValue(mockExistsResponse);

            await expect(userService.createUser({ email })).rejects.toThrow('User already exists');
            expect(mockUserRepository.checkUserExists).toHaveBeenCalledWith(email);
            expect(mockUserRepository.createUser).not.toHaveBeenCalled();
        });

        it('should throw error when email is empty', async () => {
            await expect(userService.createUser({ email: '' })).rejects.toThrow('Invalid email format');
            expect(mockUserRepository.checkUserExists).not.toHaveBeenCalled();
            expect(mockUserRepository.createUser).not.toHaveBeenCalled();
        });

        it('should throw error when email format is invalid', async () => {
            await expect(userService.createUser({ email: 'invalid-email' })).rejects.toThrow('Invalid email format');
            expect(mockUserRepository.checkUserExists).not.toHaveBeenCalled();
            expect(mockUserRepository.createUser).not.toHaveBeenCalled();
        });
    });

    describe('getUserById', () => {
        it('should return user when user exists', async () => {
            const userId = '123';
            const mockUser: User = {
                id: userId,
                email: 'test@example.com',
                createdAt: new Date(),
            };

            mockUserRepository.findById.mockResolvedValue(mockUser);

            const result = await userService.getUserById(userId);

            expect(result).toEqual(mockUser);
            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
        });

        it('should throw error when user does not exist', async () => {
            const userId = 'nonexistent-id';

            mockUserRepository.findById.mockResolvedValue(null);

            await expect(userService.getUserById(userId)).rejects.toThrow('User not found');
            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
        });
    });

    describe('email validation', () => {
        it('should accept valid email formats', async () => {
            const validEmails = [
                'user@example.com',
                'test.user@example.com',
                'user+tag@example.co.uk',
                'user123@test-domain.com',
            ];

            const mockResponse: CheckUserResponse = {
                exists: false,
                user: undefined,
            };

            mockUserRepository.checkUserExists.mockResolvedValue(mockResponse);

            for (const email of validEmails) {
                await expect(userService.checkUserExists(email)).resolves.toBeDefined();
            }
        });

        it('should reject invalid email formats', async () => {
            const invalidEmails = [
                'invalid',
                'invalid@',
                '@example.com',
                'invalid@.com',
                'invalid@domain',
                'invalid @example.com',
                'invalid@exam ple.com',
            ];

            for (const email of invalidEmails) {
                await expect(userService.checkUserExists(email)).rejects.toThrow('Invalid email format');
            }

            expect(mockUserRepository.checkUserExists).not.toHaveBeenCalled();
        });
    });
});
