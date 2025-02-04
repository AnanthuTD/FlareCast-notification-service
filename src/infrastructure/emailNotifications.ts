import { User } from "@prisma/client";
import { sendMessage } from "../kafka/producer";
import { TOPICS } from "../config/topics";
import { logger } from "../logger/logger";
import { NotificationEvent } from "../types/types";

/**
 * Generic function to send email notifications.
 */
function sendEmailNotification(
  user: User,
  data: NotificationEvent,
  template: string
) {
  if (!user.email) {
    logger.warn(`Skipping email notification: User ${user.id} has no email.`);
    return;
  }

  logger.info(`Sending ${template} email to user:`, user.email);

  const message = {
    template,
    email: user.email,
    ...data,
  };

  // Send message to the email notification service via Kafka
  sendMessage(TOPICS.EMAIL_NOTIFICATION, JSON.stringify(message));
}

// Specific email notification functions using the generic function
export const sendFirstViewEmail = (user: User, data: NotificationEvent) =>
  sendEmailNotification(user, data, "FIRST_VIEW");

export const sendCommentEmail = (user: User, data: NotificationEvent) =>
  sendEmailNotification(user, data, "COMMENT");

export const sendTranscriptSuccessEmail = (user: User, data: NotificationEvent) =>
  sendEmailNotification(user, data, "TRANSCRIPT_SUCCESS");

export const sendTranscriptFailureEmail = (user: User, data: NotificationEvent) =>
  sendEmailNotification(user, data, "TRANSCRIPT_FAILURE");

export const sendWorkspaceRemoveEmail = (user: User, data: NotificationEvent) =>
  sendEmailNotification(user, data, "WORKSPACE_REMOVE");

export const sendWorkspaceDeleteEmail = (user: User, data: NotificationEvent) =>
  sendEmailNotification(user, data, "WORKSPACE_DELETE");

export const sendVideoShareEmail = (user: User, data: NotificationEvent) =>
  sendEmailNotification(user, data, "VIDEO_SHARE");
