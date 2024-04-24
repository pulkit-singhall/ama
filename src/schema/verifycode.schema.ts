import { z } from "zod";

const verifyCodeSchema = z.object({
    code: z.string().length(6, { message: "code length should be 6 digits" }),
    email: z.string().email({message: "email format is wrong"}),
})

export {
    verifyCodeSchema
}