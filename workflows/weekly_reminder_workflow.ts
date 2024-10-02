import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { WeeklyReminderFunctionDefinition } from "../functions/weekly_reminder_function.ts";
import { UpdateDBStatusFunctionDefinition } from "../functions/update_db_status_function.ts";

const WeeklyReminderWorkflow = DefineWorkflow({
  callback_id: "weekly_reminder_workflow",
  title: "Weekly reminder workflow",
  description: "A workflow that to remind the criminals",
  input_parameters: {
    properties: {},
    required: [],
  },
});

WeeklyReminderWorkflow.addStep(UpdateDBStatusFunctionDefinition, {});

const leaderboard = WeeklyReminderWorkflow.addStep(
  WeeklyReminderFunctionDefinition,
  {}
);

WeeklyReminderWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: "C05TAS66TQW",
  message: leaderboard.outputs.leaderboardMessage,
});

export default WeeklyReminderWorkflow;
