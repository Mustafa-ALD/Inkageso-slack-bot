import { Manifest } from "deno-slack-sdk/mod.ts";
import CatchCakeMessagesWorkflow from "./workflows/cake_messages_workflow.ts";
import CakeCriminalsDatastore from "./datastores/cake_criminals_datastore.ts";
import CountVoteWorkflow from "./workflows/message_vote_workflow.ts";
import CakeLeaderboardDatastore from "./datastores/cake_leaderboard_datastore.ts";
import WeeklyReminderWorkflow from "./workflows/weekly_reminder_workflow.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "inkageso",
  description: "Kage bot der holder styr på hvem der skylder kage",
  icon: "assets/icon.png",
  workflows: [
    CatchCakeMessagesWorkflow,
    CountVoteWorkflow,
    WeeklyReminderWorkflow,
  ],
  outgoingDomains: [],
  datastores: [CakeCriminalsDatastore, CakeLeaderboardDatastore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "channels:history",
    "groups:history",
    "groups:write",
    "im:read",
    "im:write",
    "im:history",
    "mpim:read",
    "mpim:write",
    "triggers:write",
    "triggers:read",
    "reactions:read",
    "reactions:write",
  ],
});
