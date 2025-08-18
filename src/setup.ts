function setupScriptProperties(): void {
  const scriptProperties = PropertiesService.getScriptProperties();

  const requiredProperties: Record<string, string> = {
    GITHUB_TOKEN: "",
    SLACK_WEBHOOK_URL: "",
    GITHUB_USERNAME: "",
  };

  Object.keys(requiredProperties).forEach((key) => {
    if (!scriptProperties.getProperty(key)) {
      scriptProperties.setProperty(key, requiredProperties[key] || "");
    }
  });

  console.log(
    "Script properties have been initialized. Please update them with your actual values in the project settings.",
  );
  console.log("Required properties: GITHUB_TOKEN, SLACK_WEBHOOK_URL, GITHUB_USERNAME");
}

function createTimeTrigger(): void {
  ScriptApp.newTrigger("checkReactions").timeBased().everyHours(1).create();

  console.log("Time trigger created to run every 60 minutes");
}

function deleteTriggers(): void {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((trigger) => {
    ScriptApp.deleteTrigger(trigger);
  });

  console.log(`${triggers.length} triggers deleted`);
}

// Export for global access in GAS
(globalThis as Record<string, unknown>).setupScriptProperties = setupScriptProperties;
(globalThis as Record<string, unknown>).createTimeTrigger = createTimeTrigger;
(globalThis as Record<string, unknown>).deleteTriggers = deleteTriggers;
