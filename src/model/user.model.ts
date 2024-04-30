import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

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
    verifyEmailCode: string;
    verifyEmailCodeExpiry: number;
    isAcceptingMessages: boolean;
    isVerified: boolean;
    messages: Array<MessageInterface>
    forgotPasswordCode: string;
    forgotPasswordCodeExpiry: number;
    refreshToken: string;
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
    verifyEmailCode: {
        type: String,
    },
    verifyEmailCodeExpiry: {
        type: Number,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    messages: [messageSchema],
    forgotPasswordCode: {
        type: String,
    },
    forgotPasswordCodeExpiry: {
        type: Number,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    refreshToken: {
        type: String,
    }
});

userSchema.pre("save", async function () { 
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
})

export const User = mongoose.models.User as mongoose.Model<UserInterface> || mongoose.model<UserInterface>("User", userSchema)