// GitHub API Types
export interface GitHubUser {
  login: string;
}

export interface GitHubIssue {
  url: string;
  html_url: string;
  title: string;
  body: string;
  user: GitHubUser;
  pull_request?: any;
  issue_url?: string;
}

export interface GitHubComment {
  url: string;
  html_url: string;
  body: string;
  user: GitHubUser;
  issue_url: string;
}

export interface GitHubReaction {
  user: GitHubUser;
  content: string;
  created_at: string;
}

export interface ProcessedReaction {
  user: string;
  content: string;
  created_at: string;
  target_type: "issue" | "pull_request" | "comment";
  target_title: string;
  target_url: string;
  target_body: string;
}

// Slack Types
export interface SlackAttachment {
  color: string;
  title: string;
  title_link: string;
  text: string;
  footer: string;
  footer_icon: string;
  ts: number;
}

export interface SlackMessage {
  text: string;
  attachments: SlackAttachment[];
}

// Config Types
export interface Config {
  githubToken: string;
  slackWebhookUrl: string;
  githubUsername: string;
}
