import { logger } from "../../logger/logger";
import prisma from "../../prismaClient";

interface UserVerifiedEvent {
  userId: string;
  email: string;
  firstName: string;
}

export const handleUserVerifiedEvent = async (value: UserVerifiedEvent) => {
	logger.info("New verified user data received", value);

	try {
		await prisma.user.create({
			data: {
				userId: value.userId,
				email: value.email,
				username: value.firstName,
			},
		});
	} catch (error) {
		logger.error("Error creating user:", error);
	}
};
