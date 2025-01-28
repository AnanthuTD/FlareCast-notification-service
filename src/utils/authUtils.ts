import { Request } from "express";

export function getRequestUser(req: Request): { id: string } {
	return req.user as unknown as { id: string };
}
