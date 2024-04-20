import mongoose, { Schema, Document } from "mongoose";

export interface MessageInterface extends Document{
    content: string;
    createdAt: Date
}

const messageSchema: Schema<MessageInterface> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

export interface UserInterface extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    messages: Array<MessageInterface>
}

const userSchema: Schema<UserInterface> = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifyCode: {
        type: String,
    },
    verifyCodeExpiry: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    messages: [messageSchema],
});

export const User = mongoose.models.User as mongoose.Model<UserInterface> || mongoose.model<UserInterface>("User", userSchema)