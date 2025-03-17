import {z} from "zod";

export const youtubeVideoLinkVerificationSchema = z.object({
    youtubeVideoLink: z
        .string()
        .nonempty("YouTube video link requires")
        .regex(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/, "Invalid YouTube video link")
});