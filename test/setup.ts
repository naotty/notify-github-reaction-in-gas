// Google Apps Script globals mock
(globalThis as any).UrlFetchApp = {
  fetch: jest.fn().mockReturnValue({
    getContentText: () => '{"ok": true}',
    getResponseCode: () => 200
  })
};

// Type declaration for TypeScript
export {};

declare global {
  const UrlFetchApp: {
    fetch: jest.MockedFunction<any>;
  };
}