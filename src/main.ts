import { Config } from "./types";
import { fetchNewReactions } from "./github";
import { notifyToSlack } from "./slack";

function checkReactions(): void {
  const config = getConfig();
  const lastCheckedTime = getLastCheckedTime();
  const currentTime = new Date().toISOString();

  try {
    const reactions = fetchNewReactions(config.githubToken, lastCheckedTime);

    if (reactions.length > 0) {
      notifyToSlack(reactions, config.slackWebhookUrl);
    }

    setLastCheckedTime(currentTime);
  } catch (error) {
    console.error("Error checking reactions:", error);
  }
}

export function getConfig(): Config {
  const scriptProperties = PropertiesService.getScriptProperties();
  return {
    githubToken: scriptProperties.getProperty("GITHUB_TOKEN") || "",
    slackWebhookUrl: scriptProperties.getProperty("SLACK_WEBHOOK_URL") || "",
    githubUsername: scriptProperties.getProperty("GITHUB_USERNAME") || "",
  };
}

function getLastCheckedTime(): string {
  const scriptProperties = PropertiesService.getScriptProperties();
  const lastChecked = scriptProperties.getProperty("LAST_CHECKED_TIME");
  return lastChecked || new Date(Date.now() - 60 * 60 * 1000).toISOString();
}

function setLastCheckedTime(time: string): void {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("LAST_CHECKED_TIME", time);
}

// Export for global access in GAS
(globalThis as any).checkReactions = checkReactions;
