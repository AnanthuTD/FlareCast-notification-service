import { RequestHandler } from "express";
import { getRequestUser } from "../utils/authUtils";
import prisma from "../prismaClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const registerFCMTokenController = <RequestHandler>(async (req, res) => {
	const user = getRequestUser(req);
	const { fcmToken } = req.body;

	console.log("partner fcm token: " + fcmToken);

	// Check if the FCM token is provided
	if (!fcmToken) {
		return res.status(400).json({ message: "FCM token is required." });
	}

	try {
		// Update the FCM token for the delivery partner
		const updatedUser = await prisma.user.update({
			where: { userId: user.id },
			data: { fcmToken },
			select: { id: true },
		});

		// Check if the partner was found and updated
		if (!updatedUser.id) {
			return res.status(404).json({ message: "Delivery partner not found." });
		}

		// Send a success response
		res.status(200).json({ message: "FCM token updated successfully." });
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			return res.status(400).json({ message: error.message });
		}
		console.error("Error updating FCM token:", error);
		res
			.status(500)
			.json({ message: "An error occurred while updating the FCM token." });
	}
});

// TODO: REMOVE ON PRODUCTION
/* prisma.user.create({
	data: {
		userId: "67978c4f0441d1c2453927a3",
		email: "ananthu.td.dev@gmail.com",
		username: "Ananthu TD",
	},
}).catch( (error)=> {
	console.error("Error creating user:", error);
}); */
