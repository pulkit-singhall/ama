import { z } from "zod";

const messageContentSchema = z.object({
    content: z.string().min(20, {message: "content should be atleast 20 characters"}).max(300, {message: "content should not be more than 300 characters"})
})

export {
    messageContentSchema
}