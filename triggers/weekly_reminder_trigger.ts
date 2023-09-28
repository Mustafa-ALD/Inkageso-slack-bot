import { ScheduledTrigger } from "deno-slack-api/typed-method-types/workflows/triggers/scheduled.ts";
import WeeklyReminderWorkflow from "../workflows/weekly_reminder_workflow.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";

const weeklyReminderTrigger: ScheduledTrigger<
  typeof WeeklyReminderWorkflow.definition
> = {
  type: TriggerTypes.Scheduled,
  name: "Weekly reminder trigger",
  workflow: `#/workflows/${WeeklyReminderWorkflow.definition.callback_id}`,
  inputs: {},
  schedule: {
    start_time: new Date(1695988800 * 1000).toISOString(),
    frequency: {
      type: "weekly",
      repeats_every: 1,
      on_days: ["Friday"],
    },
  },
};

export default weeklyReminderTrigger;
