import { z } from "zod";

const signinSchema = z.object({
    email: z.string().email({ message: "email format is wrong" }),
    password: z.string().min(8, {message: "password should be atleast 8 characters"})
})

export {
    signinSchema
}