import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import CakeLeaderboardDatastore from "../datastores/cake_leaderboard_datastore.ts";

export const WeeklyReminderFunctionDefinition = DefineFunction({
  callback_id: "weekly_reminder_function",
  title: "Weekly reminder function",
  description:
    "A function that handles the weekly reminder and returns the leaderboard",
  source_file: "functions/weekly_reminder_function.ts",
  input_parameters: {
    properties: {},
    required: [],
  },
  output_parameters: {
    properties: {
      leaderboardMessage: {
        type: Schema.types.string,
        description: "The message containing everyone that owes cake",
      },
    },
    required: ["leaderboardMessage"],
  },
});

/**
 * Create a message that contains all of the users that owes cake which have been updated after step 1
 */

export default SlackFunction(
  WeeklyReminderFunctionDefinition,
  async ({ client }) => {
    //fetch from the db

    //leaderboardDBFetch

    const leaderboardDBFetch = await client.apps.datastore.query<
      typeof CakeLeaderboardDatastore.definition
    >({
      datastore: "CakeLeaderboard",
    });

    const leaderboardDBEntries = leaderboardDBFetch.items.map(
      ({ user_id, cakes_they_owe }) => ({ user_id, cakes_they_owe })
    );

    leaderboardDBEntries.sort((a, b) =>
      a.cakes_they_owe > b.cakes_they_owe
        ? 1
        : b.cakes_they_owe > a.cakes_they_owe
        ? -1
        : 0
    );

    let leaderboardMessage: string =
      "```     Amount of cakes they owe | name\n" +
      "---------------------------------------------------------------------------------\n";

    leaderboardDBEntries.forEach((elementFromLeaderboardDB) => {
      if (elementFromLeaderboardDB.cakes_they_owe == 0) {
        return;
      }
      const cakesTheyOweNumberLength =
        elementFromLeaderboardDB.cakes_they_owe.toString().length;

      for (let i = cakesTheyOweNumberLength; i < 29; i++) {
        leaderboardMessage += " ";
      }
      leaderboardMessage += elementFromLeaderboardDB.cakes_they_owe;
      leaderboardMessage += " | ";
      leaderboardMessage += `<@${elementFromLeaderboardDB.user_id}>`;

      leaderboardMessage += "\n";
    });
    leaderboardMessage += "```";

    return { outputs: { leaderboardMessage } };
  }
);
