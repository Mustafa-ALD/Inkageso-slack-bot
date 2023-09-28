import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ReactionFunctionDefinition } from "../functions/reaction_function.ts";

const CountVoteWorkflow = DefineWorkflow({
  callback_id: "count_vote_workflow",
  title: "Count votes workflow",
  description: "Count the votes on the bot message",
  input_parameters: {
    properties: {
      messageTs: {
        type: Schema.types.string,
      },
      reaction: {
        type: Schema.types.string,
      },
      reactionAdded: {
        type: Schema.types.boolean,
      },
    },
    required: ["messageTs", "reaction", "reactionAdded"],
  },
});

CountVoteWorkflow.addStep(ReactionFunctionDefinition, {
  messageTs: CountVoteWorkflow.inputs.messageTs,
  reaction: CountVoteWorkflow.inputs.reaction,
  reactionAdded: CountVoteWorkflow.inputs.reactionAdded,
});

export default CountVoteWorkflow;
