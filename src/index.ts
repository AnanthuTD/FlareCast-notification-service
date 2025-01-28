import app from "./app";
import env from "./env";
import prisma from "./prismaClient";
import './kafka'
import { logger } from "./logger/logger";

const start = async () => {
	try {
		app.listen(env.PORT, async () => {
			logger.info(`🟢 Server running at http://localhost:${env.PORT}`);
		});
	} catch (err) {
		logger.error(`🔴 Error starting the server: ${(err as Error).message}`);
	}
};

start();
