import WeeklyReminderWorkflow from "../workflows/weekly_reminder_workflow.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import { Trigger } from "deno-slack-api/types.ts";

const LeaderboardLinkTrigger: Trigger<
  typeof WeeklyReminderWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: "Shortcut trigger for leaderboard",
  description: "Custom trigger used for manually triggering leaderboard",
  workflow: `#/workflows/${WeeklyReminderWorkflow.definition.callback_id}`,
  inputs: {},
};

export default LeaderboardLinkTrigger;
