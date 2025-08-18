// Test global functions after build
import "../dist/slack";

// Get functions from global
const convertReactionToEmoji = (globalThis as any).convertReactionToEmoji;
const getTargetTypeLabel = (globalThis as any).getTargetTypeLabel;
const createSlackMessage = (globalThis as any).createSlackMessage;

interface ProcessedReaction {
  user: string;
  content: string;
  created_at: string;
  target_type: "issue" | "pull_request" | "comment";
  target_title: string;
  target_url: string;
  target_body: string;
}

describe("convertReactionToEmoji", () => {
  const testCases = [
    { input: "+1", expected: "👍" },
    { input: "-1", expected: "👎" },
    { input: "heart", expected: "❤️" },
    { input: "rocket", expected: "🚀" },
    { input: "unknown", expected: "unknown" },
  ];

  testCases.forEach(({ input, expected }) => {
    test(`should convert ${input} to ${expected}`, () => {
      expect(convertReactionToEmoji(input)).toBe(expected);
    });
  });
});

describe("getTargetTypeLabel", () => {
  const testCases = [
    { input: "issue", expected: "Issue" },
    { input: "pull_request", expected: "Pull Request" },
    { input: "comment", expected: "コメント" },
    { input: "unknown", expected: "unknown" },
  ];

  testCases.forEach(({ input, expected }) => {
    test(`should convert ${input} to ${expected}`, () => {
      expect(getTargetTypeLabel(input)).toBe(expected);
    });
  });
});

describe("createSlackMessage", () => {
  test("should create proper Slack message", () => {
    const testReaction: ProcessedReaction = {
      user: "testuser",
      content: "heart",
      created_at: "2024-01-01T00:00:00Z",
      target_type: "issue",
      target_title: "Test Issue",
      target_url: "https://github.com/test/test/issues/1",
      target_body: "This is a test issue body",
    };

    const message = createSlackMessage(testReaction);

    expect(message.text).toBe("testuserさんがIssueに ❤️ リアクションしました");
    expect(message.attachments).toHaveLength(1);
    expect(message.attachments?.[0]?.title).toBe("Test Issue");
    expect(message.attachments?.[0]?.title_link).toBe("https://github.com/test/test/issues/1");
  });
});