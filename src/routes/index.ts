import express from "express";
import passport from "passport";
import { registerFCMTokenController } from "../controller/registerFCM.controller";
import { PreferenceController } from "../controller/preference.controller";

const preferenceController = new PreferenceController();

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/register/fcm", registerFCMTokenController);

router.get("/preferences", preferenceController.getPreference);
router.patch("/preference", preferenceController.updatePreference);

export default router;
