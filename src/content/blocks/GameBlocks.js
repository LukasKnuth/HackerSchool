import Blockly from "node-blockly/browser";

/*
    This is where ALL available blocks for levels live. Just add them to the supplied "blocks"-variable.

    Documentation on how to create custom Blocks can be found
     here: https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks#statement_connections

    IMPORTANT: The strings used for exporting the blocks MUST be unique to the block! As a guideline, name them like
     "[component]_[operation]", e.g. "game_walk".
*/
export default function(blocks, generators) {
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
    generators['string_length'] = (block) => {
        const arg0 = Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_FUNCTION_CALL) || "''";
        return [arg0 + '.length', Blockly.JavaScript.ORDER_MEMBER];
    };

    // ----------- Movement ------------
    blocks['forward'] = {
        init() {
            this.setTooltip("Moves the character forward by one field in the direction it's currently looking at");
            this.setColour(200);
            this.setNextStatement(true);
            this.setPreviousStatement(true);
            this.appendDummyInput().appendField('forward'); // label
        }
    };
    generators['forward'] = () => "move(1);\n";

    blocks['backward'] = {
        init() {
            this.setTooltip("Moves the character back by one field in the direction it's currently looking at");
            this.setColour(200);
            this.setNextStatement(true);
            this.setPreviousStatement(true);
            this.appendDummyInput().appendField('backward'); // label
        }
    };
    generators['backward'] = () => "move(-1);\n";
}
