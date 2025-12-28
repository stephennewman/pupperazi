/**
 * Error Notification System
 * Sends alerts to Slack when critical errors occur
 */

interface ErrorDetails {
  endpoint: string;
  error: string;
  context?: Record<string, unknown>;
  timestamp?: string;
}

export async function sendErrorAlert(details: ErrorDetails): Promise<boolean> {
  const webhookUrl = process.env.SLACK_ERROR_WEBHOOK || process.env.SLACK_ANALYTICS_WEBHOOK;
  
  if (!webhookUrl) {
    console.error("No Slack webhook configured for error alerts");
    return false;
  }

  const timestamp = details.timestamp || new Date().toISOString();
  
  const message = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚨 Pupperazi Error Alert",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Endpoint:*\n\`${details.endpoint}\``,
          },
          {
            type: "mrkdwn",
            text: `*Time:*\n${new Date(timestamp).toLocaleString("en-US", { timeZone: "America/New_York" })} EST`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Error:*\n\`\`\`${details.error}\`\`\``,
        },
      },
      ...(details.context ? [{
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Context:*\n\`\`\`${JSON.stringify(details.context, null, 2)}\`\`\``,
        },
      }] : []),
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "⚠️ Action may be required • pupperazipetspa.com",
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to send error alert to Slack:", error);
    return false;
  }
}

export async function sendFormErrorAlert(
  formType: "contact" | "booking" | "lead",
  error: string,
  formData?: Record<string, unknown>
): Promise<boolean> {
  // Sanitize form data - remove sensitive info
  const sanitizedData = formData ? {
    ...formData,
    email: formData.email ? "***@***.***" : undefined,
    phone: formData.phone ? "***-***-****" : undefined,
  } : undefined;

  return sendErrorAlert({
    endpoint: `/api/${formType}`,
    error,
    context: sanitizedData,
  });
}

