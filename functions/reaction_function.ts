import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import CakeCriminalsDatastore from "../datastores/cake_criminals_datastore.ts";
import { DBSTATUS } from "../shared/db_status.ts";

export const ReactionFunctionDefinition = DefineFunction({
  callback_id: "reaction_function",
  title: "Reaction function",
  description: "A function to count the reaction votes",
  source_file: "functions/reaction_function.ts",
  input_parameters: {
    properties: {
      messageTs: {
        type: Schema.types.string,
        description: "Message to get the id from",
      },
      reaction: {
        type: Schema.types.string,
        description: "The reaction to change to the database",
      },
      reactionAdded: {
        type: Schema.types.boolean,
        description: "If the reaction should be added or subtracted",
      },
    },
    required: ["messageTs", "reaction", "reactionAdded"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  ReactionFunctionDefinition,
  async ({ inputs, client }) => {
    const messageId = inputs.messageTs.split(".").join("");

    const dbEntry = await client.apps.datastore.get<
      typeof CakeCriminalsDatastore.definition
    >({
      datastore: "CakeCriminals",
      id: messageId,
    });

    if (!dbEntry.ok) {
      return { outputs: {} };
    }

    const dbEntryItem = { ...dbEntry.item };

    const voteChange = inputs.reactionAdded ? 1 : -1;

    switch (inputs.reaction) {
      case "pog":
        dbEntryItem.votesfor += voteChange;
        break;
      case "cake":
        dbEntryItem.isGivingCakeVote += voteChange;
        break;
      case "no_entry":
        dbEntryItem.votesagainst += voteChange;
        break;
    }

    if (
      dbEntryItem.votesfor > dbEntryItem.isGivingCakeVote &&
      dbEntryItem.votesfor > dbEntryItem.votesagainst
    ) {
      dbEntryItem.status = DBSTATUS.CAKE;
    } else if (
      dbEntryItem.isGivingCakeVote > dbEntryItem.votesfor &&
      dbEntryItem.isGivingCakeVote > dbEntryItem.votesagainst
    ) {
      dbEntryItem.status = DBSTATUS.GIVING;
    } else if (
      dbEntryItem.votesagainst > dbEntryItem.votesfor &&
      dbEntryItem.votesagainst > dbEntryItem.isGivingCakeVote
    ) {
      dbEntryItem.status = DBSTATUS.NOCAKE;
    } else {
      dbEntryItem.status = DBSTATUS.UNDETERMINED;
    }

    await client.apps.datastore.put<typeof CakeCriminalsDatastore.definition>({
      datastore: "CakeCriminals",
      item: dbEntryItem,
    });

    return { outputs: {} };
  }
);
