import { z } from "zod";

const messageContentSchema = z.object({
    content: z.string()
        .min(5, { message: "content should be atleast 5 characters" })
        .max(300, { message: "content should not be more than 300 characters" }),
    username: z.string()
        .min(5)
        .max(20)
})

export {
    messageContentSchema
}