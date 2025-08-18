function notifyToSlack(reactions: ProcessedReaction[], webhookUrl: string): void {
  reactions.forEach((reaction) => {
    const message = createSlackMessage(reaction);
    sendSlackMessage(webhookUrl, message);
  });
}

function createSlackMessage(reaction: ProcessedReaction): SlackMessage {
  const emoji = convertReactionToEmoji(reaction.content);
  const targetTypeLabel = getTargetTypeLabel(reaction.target_type);

  return {
    text: `${reaction.user}さんが${targetTypeLabel}に ${emoji} リアクションしました`,
    attachments: [
      {
        color: "#36a64f",
        title: reaction.target_title,
        title_link: reaction.target_url,
        text: reaction.target_body ? reaction.target_body.substring(0, 200) + "..." : "",
        footer: "GitHub",
        footer_icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        ts: Math.floor(new Date(reaction.created_at).getTime() / 1000),
      },
    ],
  };
}

function sendSlackMessage(webhookUrl: string, message: SlackMessage): void {
  const payload = JSON.stringify(message);

  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: payload,
  });
}

function convertReactionToEmoji(reactionContent: string): string {
  const emojiMap: Record<string, string> = {
    "+1": "👍",
    "-1": "👎",
    laugh: "😄",
    confused: "😕",
    heart: "❤️",
    hooray: "🎉",
    rocket: "🚀",
    eyes: "👀",
  };

  return emojiMap[reactionContent] || reactionContent;
}

function getTargetTypeLabel(targetType: string): string {
  const labels: Record<string, string> = {
    issue: "Issue",
    pull_request: "Pull Request",
    comment: "コメント",
  };

  return labels[targetType] || targetType;
}

// Export for global access in GAS
(globalThis as Record<string, unknown>).notifyToSlack = notifyToSlack;
(globalThis as Record<string, unknown>).createSlackMessage = createSlackMessage;
(globalThis as Record<string, unknown>).convertReactionToEmoji = convertReactionToEmoji;
(globalThis as Record<string, unknown>).getTargetTypeLabel = getTargetTypeLabel;
