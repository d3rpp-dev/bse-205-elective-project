// import z from "zod";
import { trpcInstance } from "./init";
import { authMiddleware } from "../middleware";

export const userRouter = trpcInstance.router({
	getUploadedFiles: trpcInstance.procedure
		.use(authMiddleware)
		.query(async () => {
			await new Promise((res) => setTimeout(res, 1000));

			return {
				uploadedFiles: Math.floor(Math.random() * 100),
			};
		}),
});
