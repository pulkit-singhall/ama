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

userSchema.pre("save", async function () { 
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
})

userSchema.methods.comparePassword = async function (incomingPassword : string) {
    return await bcrypt.compare(incomingPassword, this.password)
}

export const User = mongoose.models.User as mongoose.Model<UserInterface> || mongoose.model<UserInterface>("User", userSchema)