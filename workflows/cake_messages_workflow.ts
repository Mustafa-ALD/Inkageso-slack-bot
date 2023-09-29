import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CakeFunctionDefinition } from "../functions/cake_function.ts";

const CatchCakeMessagesWorkflow = DefineWorkflow({
  callback_id: "catch_cake_message_workflow",
  title: "Catch cake message workflow",
  description: "A workflow to catch messages containing cake",
  input_parameters: {
    properties: {
      userMessage: {
        type: Schema.types.string,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
      timestamp: {
        type: Schema.slack.types.timestamp,
      },
    },
    required: ["userMessage", "channel", "user", "timestamp"],
  },
});



const newMessageInformation = CatchCakeMessagesWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: "C05TAS66TQW",
  message: `<@${CatchCakeMessagesWorkflow.inputs.user}> mentioned cake in <#${CatchCakeMessagesWorkflow.inputs.channel}>\n\nIf they owe cake vote with :pog:\nIf they brought cake vote with :cake:\nIf they DON'T owe cake vote :no_entry:\n\nThis is what they sent:\n>${CatchCakeMessagesWorkflow.inputs.userMessage}`,
});


CatchCakeMessagesWorkflow.addStep(CakeFunctionDefinition, {
  newMessageTs: newMessageInformation.outputs.message_link,
  message: CatchCakeMessagesWorkflow.inputs.userMessage,
  user: CatchCakeMessagesWorkflow.inputs.user,
  timestamp: CatchCakeMessagesWorkflow.inputs.timestamp,
});

export default CatchCakeMessagesWorkflow;
