function fetchNewReactions(githubToken: string, since: string): ProcessedReaction[] {
  const scriptProperties = PropertiesService.getScriptProperties();
  const username = scriptProperties.getProperty("GITHUB_USERNAME") || "";
  const reactions: ProcessedReaction[] = [];

  const issues = fetchUserIssuesAndPRs(githubToken, username);

  issues.forEach((issue) => {
    const issueReactions = fetchReactionsForIssue(githubToken, issue, since);
    reactions.push(...issueReactions);

    const comments = fetchCommentsForIssue(githubToken, issue);
    comments.forEach((comment) => {
      if (comment.user.login === username) {
        const commentReactions = fetchReactionsForComment(githubToken, comment, since);
        reactions.push(...commentReactions);
      }
    });
  });

  return reactions;
}

function fetchUserIssuesAndPRs(githubToken: string, username: string): GitHubIssue[] {
  const items: GitHubIssue[] = [];

  // Issueを取得
  const issueQuery = `author:${username} is:issue`;
  const issueUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(
    issueQuery,
  )}&sort=updated&order=desc`;

  const issueResponse = UrlFetchApp.fetch(issueUrl, {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  const issueData = JSON.parse(issueResponse.getContentText());
  items.push(...issueData.items);

  // Pull Requestを取得
  const prQuery = `author:${username} is:pull-request`;
  const prUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(
    prQuery,
  )}&sort=updated&order=desc`;

  const prResponse = UrlFetchApp.fetch(prUrl, {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  const prData = JSON.parse(prResponse.getContentText());
  items.push(...prData.items);

  return items;
}

function fetchReactionsForIssue(
  githubToken: string,
  issue: GitHubIssue,
  since: string,
): ProcessedReaction[] {
  const url = `${issue.url}/reactions`;

  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github.squirrel-girl-preview+json",
    },
  });

  const reactions: GitHubReaction[] = JSON.parse(response.getContentText());
  return filterNewReactions(reactions, since, issue);
}

function fetchCommentsForIssue(githubToken: string, issue: GitHubIssue): GitHubComment[] {
  const url = `${issue.url}/comments`;

  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  return JSON.parse(response.getContentText());
}

function fetchReactionsForComment(
  githubToken: string,
  comment: GitHubComment,
  since: string,
): ProcessedReaction[] {
  const url = `${comment.url}/reactions`;

  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github.squirrel-girl-preview+json",
    },
  });

  const reactions: GitHubReaction[] = JSON.parse(response.getContentText());
  return filterNewReactions(reactions, since, comment);
}

function filterNewReactions(
  reactions: GitHubReaction[],
  since: string,
  target: GitHubIssue | GitHubComment,
): ProcessedReaction[] {
  return reactions
    .filter((reaction) => new Date(reaction.created_at) > new Date(since))
    .map((reaction) => ({
      user: reaction.user.login,
      content: reaction.content,
      created_at: reaction.created_at,
      target_type: (target as GitHubIssue).pull_request
        ? "pull_request"
        : (target as GitHubComment).issue_url
          ? "comment"
          : "issue",
      target_title: (target as GitHubIssue).title || "コメント",
      target_url: target.html_url,
      target_body: target.body,
    }));
}

// Export for global access in GAS
(globalThis as Record<string, unknown>).fetchNewReactions = fetchNewReactions;
