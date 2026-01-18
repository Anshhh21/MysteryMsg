import { z } from "zod";

export const messageSchema = z.object({
    content: z.string().min(5, { message: "Message content cannot be empty" }).max(300, { message: "Message content cannot exceed 1000 characters" })

});
