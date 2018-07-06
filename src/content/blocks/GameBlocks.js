import Blockly from "node-blockly/browser";
import * as api from "./API";

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
    generators['forward'] = () => `${api.FUNCTION_MOVE}(1);\n`;

    blocks['backward'] = {
        init() {
            this.setTooltip("Moves the character back by one field in the direction it's currently looking at");
            this.setColour(GAME_HUE);
            this.setNextStatement(true);
            this.setPreviousStatement(true);
            this.appendDummyInput().appendField('go backward'); // label
        }
    };
    generators['backward'] = () => `${api.FUNCTION_MOVE}(-1);\n`;

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
    generators['turn_left'] = () => `${api.FUNCTION_TURN}(-90);\n`;

    blocks['turn_right'] = {
        init() {
            this.setTooltip("Spins the character 90° to the right.");
            this.setColour(GAME_HUE);
            this.setNextStatement(true);
            this.setPreviousStatement(true);
            this.appendDummyInput().appendField('turn right'); // label
        }
    };
    generators['turn_right'] = () => `${api.FUNCTION_TURN}(90);\n`;

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
    const tileTypeEnum = [
        ["crystal", api.PARAM_COLLECTIBLE], ["trap", api.PARAM_TRAP],
        ["enemy color", api.PARAM_ENEMY_COLOR], ["enemy", api.PARAM_ENEMY],
        ["green", api.PARAM_GREEN], ["blue", api.PARAM_BLUE],
        ["pit", api.PARAM_PIT], ["floor", api.PARAM_FLOOR],
    ];

    blocks['sensor_camera'] = {
        init() {
            this.appendDummyInput().appendField("camera sees")
                .appendField(new Blockly.FieldDropdown(tileTypeEnum), "tile_type");
            this.setInputsInline(true);
            this.setOutput(true, "Boolean");
            this.setColour(GAME_HUE);
            this.setTooltip("Use the camera to check a tile one step in the current player direction.");
        }
    };
    generators['sensor_camera'] = (block) => {
        const tile_type = block.getFieldValue('tile_type');
        return [`${api.FUNCTION_SENSOR_CAMERA}("${tile_type}")`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    };

    blocks['sensor_radar'] = {
        init() {
            this.appendDummyInput().appendField("radar senses")
                .appendField(new Blockly.FieldDropdown(tileTypeEnum), "tile_type");
            this.setInputsInline(true);
            this.setOutput(true, "Boolean");
            this.setColour(GAME_HUE);
            this.setTooltip("Use the radar to check a two tiles area around the current player position.");
        }
    };
    generators['sensor_radar'] = (block) => {
        const tile_type = block.getFieldValue('tile_type');
        return [`${api.FUNCTION_SENSOR_RADAR}("${tile_type}")`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    };

}
