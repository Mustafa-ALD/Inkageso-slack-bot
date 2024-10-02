import { TriggerEventTypes, TriggerTypes } from "deno-slack-api/mod.ts";
import { Trigger } from "deno-slack-sdk/types.ts";
import CountVoteWorkflow from "../workflows/message_vote_workflow.ts";

const reactionRemovedTrigger: Trigger<typeof CountVoteWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "Reaction removed trigger",
  workflow: `#/workflows/${CountVoteWorkflow.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.ReactionRemoved,
    channel_ids: ["C05TAS66TQW"],
    filter: {
      root: {
        operator: "OR",
        inputs: [
          {
            statement: "{{data.reaction}} == pog",
          },
          {
            statement: "{{data.reaction}} == cake",
          },
          {
            statement: "{{data.reaction}} == no_entry",
          },
        ],
      },
      version: 1,
    },
  },
  inputs: {
    messageTs: {
      value: "{{data.message_ts}}",
    },
    reaction: {
      value: "{{data.reaction}}",
    },
    reactionAdded: {
      value: "false",
    },
  },
};

export default reactionRemovedTrigger;
