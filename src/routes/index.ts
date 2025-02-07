import express from "express";
import passport from "passport";
import { registerFCMTokenController } from "../controller/registerFCM.controller";
import { PreferenceController } from "../controller/preference.controller";
import NotificationController from "../controller/notification.controller";

const preferenceController = new PreferenceController();
const notificationController = new NotificationController();

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/register/fcm", registerFCMTokenController);

router.get("/preferences", preferenceController.getPreference);
router.patch("/preference", preferenceController.updatePreference);

router.get("/", notificationController.getUserNotifications)
router.patch("/read", notificationController.markAsRead)
router.patch("/read/all", notificationController.markAllAsRead)
router.delete("/", notificationController.deleteNotification)

router.get("/count", notificationController.getUnreadNotificationCount)

export default router;
