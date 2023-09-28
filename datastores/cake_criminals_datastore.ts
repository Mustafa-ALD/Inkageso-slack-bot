import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Datastores are a Slack-hosted location to store
 * and retrieve data for your app.
 * https://api.slack.com/automation/datastores
 */
const CakeCriminalsDatastore = DefineDatastore({
  name: "CakeCriminals",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    user_id: {
      type: Schema.slack.types.user_id,
    },
    original_msg: {
      type: Schema.types.string,
    },
    timestamp: {
      type: Schema.types.string,
    },
    votesfor: {
      type: Schema.types.number,
    },
    isGivingCakeVote: {
      type: Schema.types.number,
    },
    votesagainst: {
      type: Schema.types.number,
    },
    status: {
      type: Schema.types.string,
    },
  },
});

export default CakeCriminalsDatastore;

/**
 * user id
 * original message
 * timestamp
 * boolean for approval
 */
