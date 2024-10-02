import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerEventTypes, TriggerTypes } from "deno-slack-api/mod.ts";
import CatchCakeMessagesWorkflow from "../workflows/cake_messages_workflow.ts";

const catchCakeMessagesTrigger: Trigger<
  typeof CatchCakeMessagesWorkflow.definition
> = {
  type: TriggerTypes.Event,
  name: "Catch Cake trigger",
  workflow: `#/workflows/${CatchCakeMessagesWorkflow.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    channel_ids: ["CE69LDA56", "C05TDMNN83X"],
    filter: {
      root: {
        operator: "AND",
        inputs: [
          {
            operator: "NOT",
            inputs: [
              {
                statement: "{{data.user_id}} == null",
              },
            ],
          },
          {
            operator: "NOT",
            inputs: [
              {
                statement: "{{data.user_id}} == U049YADHDL3",
              },
            ],
          },
          {
            statement: "{{data.thread_ts}} == null",
          },
          {
            operator: "OR",
            inputs: [
              {
                statement: "{{data.text}} CONTAINS kage",
              },
              {
                statement: "{{data.text}} CONTAINS cake",
              },
              {
                statement: "{{data.text}} CONTAINS inkageso",
              },
            ],
          },
        ],
      },
      version: 1,
    },
  },
  inputs: {
    userMessage: {
      value: "{{data.text}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
    user: {
      value: "{{data.user_id}}",
    },
    timestamp: {
      value: "{{event_timestamp}}",
    },
  },
};

export default catchCakeMessagesTrigger;
