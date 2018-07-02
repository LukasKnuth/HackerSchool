import Blockly from "node-blockly/browser";

const GAME_HUE = 30;
const DEBUG_HUE = 345;

function escapeString(value) {
    return value.replace(/['"]/g, `\\"`);
}

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
            this.setColour(GAME_HUE);
            this.setNextStatement(true);
            this.setPreviousStatement(true);
            this.appendDummyInput().appendField('go forward'); // label
        }
    };
    generators['forward'] = () => "move(1);\n";

    blocks['backward'] = {
        init() {
            this.setTooltip("Moves the character back by one field in the direction it's currently looking at");
            this.setColour(GAME_HUE);
            this.setNextStatement(true);
            this.setPreviousStatement(true);
            this.appendDummyInput().appendField('go backward'); // label
        }
    };
    generators['backward'] = () => "move(-1);\n";

    // --------- Rotation ------------
    blocks['turn_left'] = {
        init() {
            this.setTooltip("Spins the character 90° to the left.");
            this.setColour(GAME_HUE);
            this.setNextStatement(true);
            this.setPreviousStatement(true);
            this.appendDummyInput().appendField('turn left'); // label
        }
    };
    generators['turn_left'] = () => "turn(-90);\n";

    blocks['turn_right'] = {
        init() {
            this.setTooltip("Spins the character 90° to the right.");
            this.setColour(GAME_HUE);
            this.setNextStatement(true);
            this.setPreviousStatement(true);
            this.appendDummyInput().appendField('turn right'); // label
        }
    };
    generators['turn_right'] = () => "turn(90);\n";

    // --------- DEBUG -----------
    blocks['debug_log'] = {
        init() {
            this.setTooltip("Logs the given variable to the Debug Log in the bottom right corner.");
            this.setColour(DEBUG_HUE);
            this.setNextStatement(true);
            this.setPreviousStatement(true);
            this.appendDummyInput().appendField('log'); // label
            this.appendValueInput("value").setCheck(null);
            this.setInputsInline(true);
        }
    };
    generators['debug_log'] = (block) => {
        const input = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
        const escapedInput = escapeString(input);
        return `debugLog("${escapedInput || "[no input]"}", (${input || "''"}).toString(), "${block.id}");\n`;
    };

    // ------- SENSORS ---------
    blocks['sensor_camera'] = {
        init() {
            this.appendDummyInput().appendField("camera");
            this.setOutput(true, "Tile");
            this.setColour(GAME_HUE);
            this.setTooltip("Use the camera to check a Tile on step in the current player direction.");
        }
    };
    generators['sensor_camera'] = () => {
        return ["sensorCamera()", Blockly.JavaScript.ORDER_FUNCTION_CALL];
    };

    // ------ TILES ---------
    blocks['has_collectible'] = {
        init() {
            this.appendValueInput("sensor_result").setCheck("Tile").appendField("result");
            this.appendDummyInput()
                .appendField("has")
                .appendField(new Blockly.FieldDropdown([
                    ["a collectible", "collectible"], ["a trap", "trap"],
                    ["an enemy color", "enemy_color"], ["an enemy", "enemy"],
                ]), "tile_type");
            this.setInputsInline(true);
            this.setOutput(true, "Boolean");
            this.setColour(GAME_HUE);
            this.setTooltip("Checks if the given Sensor result has a collectible in it.");
        }
    };
    generators['has_collectible'] = (block) => {
        const sensor_result = Blockly.JavaScript.valueToCode(block, 'sensor_result', Blockly.JavaScript.ORDER_ATOMIC);
        const tile_type = block.getFieldValue('tile_type');
        return [`tileHas("${tile_type}", ${sensor_result || "null"})`, Blockly.JavaScript.ORDER_NONE];
    }

}
