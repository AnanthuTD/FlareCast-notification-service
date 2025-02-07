import { PrismaClient, NotifChannelPrefs } from "@prisma/client";

const defaultPreferenceObject: NotifChannelPrefs = {
	email: true,
	push: true,
};

const prisma = new PrismaClient().$extends({
	name: "notificationPreferenceDefaults",
	query: {
		user: {
			async create({ args, query }) {
				const data = args.data;

				data.firstViewNotifications ??= defaultPreferenceObject;
				data.commentNotifications ??= defaultPreferenceObject;
				data.transcriptSuccessNotifications ??= defaultPreferenceObject;
				data.transcriptFailureNotifications ??= defaultPreferenceObject;
				data.shareNotifications ??= defaultPreferenceObject;
				data.removeFromWorkspaceNotification ??= defaultPreferenceObject;
				data.workspaceDeleteNotification ??= defaultPreferenceObject;
				data.workspaceInvitationNotification ??= defaultPreferenceObject;

				args.data = data;

				return query(args);
			},
		},
	},
});

export default prisma;
