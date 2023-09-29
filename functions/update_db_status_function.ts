import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import CakeCriminalsDatastore from "../datastores/cake_criminals_datastore.ts";
import { DBSTATUS } from "../shared/db_status.ts";
import CakeLeaderboardDatastore from "../datastores/cake_leaderboard_datastore.ts";

export const UpdateDBStatusFunctionDefinition = DefineFunction({
  callback_id: "update_db_status_function",
  title: "Update db status function",
  description: "A function that updates the status of this weeks db entries",
  source_file: "functions/update_db_status_function.ts",
  input_parameters: {
    properties: {},
    required: [],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

/**
 * Look through this weeks of bot messages and determine if users owe cake or if they brought cake
 * Change the db entries to match the final vote tallying
 */

export default SlackFunction(
  UpdateDBStatusFunctionDefinition,
  async ({ client }) => {
    const nowInMiliseconds = Date.now();
    const nowInSeconds = Math.floor(nowInMiliseconds / 1000);
    const lastWeekInSeconds = nowInSeconds - 604800;

    const cakeCriminalsDBFetch = await client.apps.datastore.query<
      typeof CakeCriminalsDatastore.definition
    >({
      datastore: "CakeCriminals",
    });

    if (!cakeCriminalsDBFetch.ok) {
      console.error(
        "file: update_db_status_function.ts:44 ~ dbFetch:",
        cakeCriminalsDBFetch.error
      );
      return { outputs: {} };
    }

    const dbEntriesCakeCriminals = cakeCriminalsDBFetch.items.map(
      ({
        id,
        user_id,
        original_msg,
        timestamp,
        votesfor,
        isGivingCakeVote,
        votesagainst,
        status,
      }) => ({
        id,
        user_id,
        original_msg,
        timestamp,
        votesfor,
        isGivingCakeVote,
        votesagainst,
        status,
      })
    );

    const cakeCriminalsDBEntiresFiltered = dbEntriesCakeCriminals.filter(
      (elementFromCakeCriminalsDB) => {
        return (
          (elementFromCakeCriminalsDB.status == DBSTATUS.CAKE ||
            elementFromCakeCriminalsDB.status == DBSTATUS.GIVING) &&
          parseInt(elementFromCakeCriminalsDB.timestamp) > lastWeekInSeconds
        );
      }
    );

    const leaderboardDBFetch = await client.apps.datastore.query<
      typeof CakeLeaderboardDatastore.definition
    >({
      datastore: "CakeLeaderboard",
    });

    const dbEntiresLeaderboard = leaderboardDBFetch.items.map(
      ({ user_id, cakes_they_owe }) => ({ user_id, cakes_they_owe })
    );

    cakeCriminalsDBEntiresFiltered.forEach((elementFromCakeCriminalsDB) => {
      if (
        !dbEntiresLeaderboard.some(
          (elementFromLeaderboardDB) =>
            elementFromLeaderboardDB.user_id ==
            elementFromCakeCriminalsDB.user_id
        )
      ) {
        dbEntiresLeaderboard.push({
          user_id: elementFromCakeCriminalsDB.user_id,
          cakes_they_owe: 0,
        });
        return;
      }

      const leaderboardEntryIndex = dbEntiresLeaderboard.findIndex(
        (elementFromLeaderboardDB) =>
          elementFromLeaderboardDB.user_id == elementFromCakeCriminalsDB.user_id
      );

      if (leaderboardEntryIndex == undefined) {
        console.error(
          "file: update_db_status_function.ts:108 ~ dbEntiresFiltered.forEach ~ leaderboardEntry:",
          leaderboardEntryIndex
        );
        return;
      }

      if (elementFromCakeCriminalsDB.status == DBSTATUS.CAKE) {
        dbEntiresLeaderboard[leaderboardEntryIndex].cakes_they_owe += 1;
      } else if (elementFromCakeCriminalsDB.status == DBSTATUS.GIVING) {
        dbEntiresLeaderboard[leaderboardEntryIndex].cakes_they_owe -= 1;
      }
    });

    for (const elementFromLeaderboardDB of dbEntiresLeaderboard) {
      if (elementFromLeaderboardDB.cakes_they_owe < 0) {
        elementFromLeaderboardDB.cakes_they_owe = 0;
      }

      await client.apps.datastore.put<
        typeof CakeLeaderboardDatastore.definition
      >({
        datastore: "CakeLeaderboard",
        item: elementFromLeaderboardDB,
      });
    }

    for (const elementFromCakeCriminalsDB of dbEntriesCakeCriminals) {
      await client.apps.datastore.delete<
        typeof CakeCriminalsDatastore.definition
      >({
        datastore: "CakeCriminals",
        id: elementFromCakeCriminalsDB.id,
      });
    }

    return { outputs: {} };
  }
);
