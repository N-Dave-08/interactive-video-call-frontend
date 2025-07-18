import { z } from "zod";

// Zod validation schemas
export const addUserSchema = z.object({
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Invalid email address"),
	phone_number: z.string().optional(),
	place_of_assignment: z.string().min(1, "Place of assignment is required"),
	role: z.enum(["admin", "social_worker"]),
	condition: z.literal("pending"),
	password: z.string().optional(),
});

export const editUserSchema = z.object({
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Invalid email address"),
	phone_number: z.string().optional(),
	place_of_assignment: z.string().min(1, "Place of assignment is required"),
	role: z.enum(["admin", "social_worker"]),
	condition: z.enum(["approved", "pending", "rejected", "blocked"]),
});

// Type exports
export type AddUserData = z.infer<typeof addUserSchema>;
export type EditUserData = z.infer<typeof editUserSchema>;
