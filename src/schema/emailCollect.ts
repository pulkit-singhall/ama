import {z} from "zod"

export const emailCollectSchema = z.string().email()