import express from "express";
import passport from "passport";
import { registerFCMTokenController } from "../controller/registerFCM.controller";

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/register/fcm", registerFCMTokenController);

export default router;
