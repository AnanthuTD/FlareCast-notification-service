import app from "./app";
import env from "./env";
import prisma from "./prismaClient";
import './kafka'
import { logger } from "./logger/logger";

const start = async () => {
	try {
		app.listen(env.PORT, async () => {
			logger.info(`🟢 Server running at http://localhost:${env.PORT}`);
			logger.info(`mongodb is available on port ${env.DATABASE_URL}`)
			logger.info(await prisma.user.findMany())
		});
	} catch (err) {
		logger.error(`🔴 Error starting the server: ${(err as Error).message}`);
	}
};

start();
