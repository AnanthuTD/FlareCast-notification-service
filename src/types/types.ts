export enum NOTIFICATION_EVENT_TYPE {
	FIRST_VIEW = "firstView",
	COMMENT = "comment",
	TRANSCRIPT_SUCCESS = "transcript_success",
	TRANSCRIPT_FAILURE = "transcript_failure",
	WORKSPACE_REMOVE = "workspace_remove",
	WORKSPACE_DELETE = "workspace_delete",
	VIDEO_SHARE = "video_share",
	WORKSPACE_INVITATION = "workspace_invitation",
}

export interface FirstViewNotificationEvent {
	eventType: NOTIFICATION_EVENT_TYPE.FIRST_VIEW;
	userId: string;
	videoName: string;
	videoId: string;
	viewerName: string;
	timestamp: number;
}

export interface CommentNotificationEvent {
	eventType: NOTIFICATION_EVENT_TYPE.COMMENT;
	userId: string;
	videoName: string;
	videoId: string;
	commenterName: string;
	timestamp: number;
}

export interface TranscriptSuccessNotificationEvent {
	eventType: NOTIFICATION_EVENT_TYPE.TRANSCRIPT_SUCCESS;
	userId: string;
	videoId: string;
	videoName: string;
	timestamp: number;
}

export interface TranscriptFailureNotificationEvent {
	eventType: NOTIFICATION_EVENT_TYPE.TRANSCRIPT_FAILURE;
	userId: string;
	videoId: string;
	timestamp: number;
}

export interface WorkspaceRemoveNotificationEvent {
	eventType: NOTIFICATION_EVENT_TYPE.WORKSPACE_REMOVE;
	userId: string;
	workspaceId: string;
	workspaceName: string;
	timestamp: number;
}

export interface WorkspaceDeleteNotificationEvent {
	eventType: NOTIFICATION_EVENT_TYPE.WORKSPACE_DELETE;
	userId: string;
	workspaceId: string;
	workspaceName: string;
	timestamp: number;
}

export interface VideoShareNotificationEvent {
	eventType: NOTIFICATION_EVENT_TYPE.VIDEO_SHARE;
	userId: string;
	url: string;
	sharerId: string;
	sharerName: string;
	videoName: string;
	timestamp: number;
}

export interface WorkspaceInvitationNotificationEvent {
	eventType: NOTIFICATION_EVENT_TYPE.WORKSPACE_INVITATION;
	senderId: string;
	invites: {
		receiverEmail: string;
		url: string;
		receiverId?: string;
	}[];
	workspaceId: string;
	workspaceName: string;
	timestamp: number;
	userId: null
}

// Union type for all possible notification events
export type NotificationEvent =
	| FirstViewNotificationEvent
	| CommentNotificationEvent
	| TranscriptSuccessNotificationEvent
	| TranscriptFailureNotificationEvent
	| WorkspaceRemoveNotificationEvent
	| WorkspaceDeleteNotificationEvent
	| VideoShareNotificationEvent
	| WorkspaceInvitationNotificationEvent;
