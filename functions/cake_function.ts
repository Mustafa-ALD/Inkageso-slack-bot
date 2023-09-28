import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import CakeCriminalsDatastore from "../datastores/cake_criminals_datastore.ts";

export const CakeFunctionDefinition = DefineFunction({
  callback_id: "cake_function",
  title: "Cake function",
  description: "A Cake function",
  source_file: "functions/cake_function.ts",
  input_parameters: {
    properties: {
      newMessageTs: {
        type: Schema.types.string,
        description:
          "The link of the new message to use the ts as id in the db",
      },
      message: {
        type: Schema.types.string,
        description: "Message to be posted",
      },
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
      timestamp: {
        type: Schema.slack.types.timestamp,
        description: "The timestamp of the post",
      },
    },
    required: ["newMessageTs", "message", "user", "timestamp"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  CakeFunctionDefinition,
  async ({ inputs, client }) => {
    const pattern = /(?<=\/p)\d{10,}/gm;
    const matchedArray = inputs.newMessageTs?.match(pattern);
    if (!matchedArray) {
      console.error("file: cake_function.ts:56 ~ matchedArray is empty");
      return { outputs: {} };
    }
    const id = matchedArray[0];

    const cakeCriminalObject = {
      id: id,
      user_id: inputs.user,
      original_msg: inputs.message,
      timestamp: inputs.timestamp,
      votesfor: 0,
      isGivingCakeVote: 0,
      votesagainst: 0,
      status: "UNDETERMINED",
    };

    await client.apps.datastore.put<typeof CakeCriminalsDatastore.definition>({
      datastore: "CakeCriminals",
      item: cakeCriminalObject,
    });

    return { outputs: {} };
  }
);
