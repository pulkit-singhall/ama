import mongoose, { Schema, Document } from "mongoose";

interface Message extends Document{
    content: string;
    createdAt: Date
}

const messageSchema: Schema<Message> = new Schema({
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

interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    messages: Message[]
}

const userSchema: Schema<User> = new Schema({
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

const User = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema)

export {
    User,
    userSchema,
    messageSchema,
}