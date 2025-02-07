import { User } from "@prisma/client";
import { NOTIFICATION_EVENT_TYPE, NotificationEvent } from "../types/types";

export function getNotificationMessage(event: NotificationEvent, user: User) {
	switch (event.eventType) {
		case NOTIFICATION_EVENT_TYPE.FIRST_VIEW:
			return {
				title: `🚀 Your Video Just Got Its First View!`,
				content: `Hey, great news! Your video "${event.videoName}" just got its first view. Keep up the great work!`,
			};

		case NOTIFICATION_EVENT_TYPE.COMMENT:
			return {
				title: `💬 New Comment on "${event.videoName}"`,
				content: `Hey, someone just commented on your video. Click to see what they said!`,
			};

		case NOTIFICATION_EVENT_TYPE.TRANSCRIPT_SUCCESS:
			return {
				title: `✅ Transcript Ready for "${event.videoName}"`,
				content: `Your video transcript has been successfully generated. View it now and make your content even more accessible!`,
			};

		case NOTIFICATION_EVENT_TYPE.TRANSCRIPT_FAILURE:
			return {
				title: `❌ Transcript Failed for "${event.videoId}"`,
				content: `Oops! We couldn’t generate a transcript for your video. Please try again or contact support.`,
			};

		case NOTIFICATION_EVENT_TYPE.WORKSPACE_REMOVE:
			return {
				title: `⚠️ Removed from Workspace "${event.workspaceName}"`,
				content: `You have been removed from the workspace "${event.workspaceName}". If this was unexpected, reach out to the workspace admin.`,
			};

		case NOTIFICATION_EVENT_TYPE.WORKSPACE_DELETE:
			return {
				title: `🚨 Workspace "${event.workspaceName}" Deleted`,
				content: `The workspace "${event.workspaceName}" has been deleted. All associated data is no longer available.`,
			};

		case NOTIFICATION_EVENT_TYPE.VIDEO_SHARE:
			return {
				title: `📢 Your Video Has Been Shared!`,
				content: `Your video "${event.videoName}" has been shared with others. Check it out and engage with your audience!`,
			};

		case NOTIFICATION_EVENT_TYPE.WORKSPACE_INVITATION:
			return {
				title: `📩 Invitation to Join "${event.workspaceName}"`,
				content: `Hey, you've been invited to join the workspace "${event.workspaceName}". Click here to accept the invitation!`,
			};

		default:
			return {
				title: `🔔 New Notification`,
				content: `You have a new notification. Open the app to check it out!`,
			};
	}
}
