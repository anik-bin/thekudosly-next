import mongoose, { Schema, model, models, Document } from "mongoose";

export interface User extends Document {
    _id: mongoose.Types.ObjectId;
    username?: string;
    email: string;
    profilePicture?: string;
    kudos: number;
    lastKudosRefresh: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema: Schema<User> = new Schema(
    {
        username: {
            type: String,
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email address"],
        },
        profilePicture: {
            type: String,
        },
        kudos: {
            type: Number,
            default: 3,
            min: 0,
        },
        lastKudosRefresh: {
            type: Number,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
)

const UserModel = models?.User as mongoose.Model<User> || model<User>("User", userSchema);

export default UserModel;