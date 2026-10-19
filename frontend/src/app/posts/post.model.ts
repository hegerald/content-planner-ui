/**
 * Typen der UI-API (/ui-api) des UI-Service.
 * Quelle der Wahrheit ist der OpenAPI-Contract unter ui-service/openapi/.
 */

export interface ActionView {
  targetStatus: string;
  label: string;
}

export interface PostView {
  id: number;
  title: string;
  text: string;
  channel: string;
  channelName: string;
  status: string;
  statusLabel: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  updatedAt: string;
  editable: boolean;
  deletable: boolean;
  actions: ActionView[];
}

export interface ChannelView {
  channel: string;
  displayName: string;
  maxLength: number;
}

export interface PostInput {
  title: string;
  text: string;
  channel: string;
  /** ISO-8601 in UTC oder null */
  scheduledAt: string | null;
}

export interface ErrorView {
  status: number;
  code: string;
  message: string;
}
