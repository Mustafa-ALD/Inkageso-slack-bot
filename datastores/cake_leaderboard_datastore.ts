import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const CakeLeaderboardDatastore = DefineDatastore({
  name: "CakeLeaderboard",
  primary_key: "user_id",
  attributes: {
    user_id: {
      type: Schema.slack.types.user_id,
    },
    cakes_they_owe: {
      type: Schema.types.number,
    },
  },
});

export default CakeLeaderboardDatastore;
