import { z } from "zod";

const verifyCodeSchema = z.object({
    code: z.string().length(6, {message: "code length should be 6 digits"})
})

export {
    verifyCodeSchema
}