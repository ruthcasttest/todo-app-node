import { db } from "../../config/firebase.config";
import { CheckUserResponse, CreateUserDto, User } from "../../domain/models/user.model";
import { UserRepositoryPort } from "../../domain/ports/user.repository.port";

export class UserFirestoreRepository implements UserRepositoryPort {
    private readonly collection = db.collection("users");

    async checkUserExists(email: string): Promise<CheckUserResponse> {
        const snapshot = await this.collection.where("email", "==", email).limit(1).get();
        
        if (snapshot.empty) {
            return { exists: false };
        }

        const doc = snapshot.docs[0];
        const data = doc.data();
        
        return {
            exists: true,
            user: {
                id: doc.id,
                email: data.email,
                createdAt: data.createdAt.toDate()
            }
        };
    }

    async createUser(dto: CreateUserDto): Promise<User> {
        const docRef = await this.collection.add({
            email: dto.email,
            createdAt: new Date()
        });

        const doc = await docRef.get();
        const data = doc.data();

        if (!data) {
            throw new Error("Failed to create user");
        }

        return {
            id: doc.id,
            email: data.email,
            createdAt: data.createdAt.toDate()
        };
    }

    async findById(id: string): Promise<User | null> {
        const doc = await this.collection.doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data();
        if (!data) {
            return null;
        }

        return {
            id: doc.id,
            email: data.email,
            createdAt: data.createdAt.toDate()
        };
    }
}
