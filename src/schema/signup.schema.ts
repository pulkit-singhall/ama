import { z } from "zod";

const signupSchema = z.object({
    username: z.string()
        .min(5, { message: "username should be atleast 5 characters long" })
        .max(20, { message: "usename should be not more than 20 characters" }),
    email: z.string()
        .email({ message: "email format is wrong" }),
    password: z.string()
        .min(8, { message: "password should be atleast 8 characters" }),
})

export {
    signupSchema
}