// GitHub API Types
interface GitHubUser {
  login: string;
}

interface GitHubIssue {
  url: string;
  html_url: string;
  title: string;
  body: string;
  user: GitHubUser;
  pull_request?: any;
  issue_url?: string;
}

interface GitHubComment {
  url: string;
  html_url: string;
  body: string;
  user: GitHubUser;
  issue_url: string;
}

interface GitHubReaction {
  user: GitHubUser;
  content: string;
  created_at: string;
}

interface ProcessedReaction {
  user: string;
  content: string;
  created_at: string;
  target_type: "issue" | "pull_request" | "comment";
  target_title: string;
  target_url: string;
  target_body: string;
}

// Slack Types
interface SlackAttachment {
  color: string;
  title: string;
  title_link: string;
  text: string;
  footer: string;
  footer_icon: string;
  ts: number;
}

interface SlackMessage {
  text: string;
  attachments: SlackAttachment[];
}

// Config Types
interface Config {
  githubToken: string;
  slackWebhookUrl: string;
  githubUsername: string;
}
