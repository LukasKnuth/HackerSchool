/*
    This is where ALL available blocks for levels live. Just add them to the supplied "blocks"-variable.

    Documentation on how to create custom Blocks can be found
     here: https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks#statement_connections

    IMPORTANT: The strings used for exporting the blocks MUST be unique to the block! As a guideline, name them like
     "[component]_[operation]", e.g. "game_walk".
*/
export default function(blocks) {
    blocks['string_length'] = {
        init() {
            this.appendValueInput('VALUE')
                .setCheck('String')
                .appendField('length of');
            this.setOutput(true, 'Number');
            this.setColour(160);
            this.setTooltip('Returns number of letters in the provided text.');
            this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
        }
    };
}
