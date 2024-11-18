// const vine = require("@vinejs/vine");
import vine from "@vinejs/vine";

export const registerSchema = vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6).confirmed(),
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
    image: vine.string().optional(),
    color: vine.number().optional(),
    profileSetup: vine.boolean().optional(),
})

export const loginSchema = vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
})