import app from "./app";
import env from "./env";
import prisma from "./prismaClient";

const start = async () => {
	try {
		app.listen(env.PORT, async () => {
			console.info(`🟢 Server running at http://localhost:${env.PORT}`);
			console.info(`mongodb is available on port ${env.DATABASE_URL}`)
			console.log(await prisma.user.findMany())
		});
	} catch (err) {
		console.error(`🔴 Error starting the server: ${(err as Error).message}`);
	}
};

start();
