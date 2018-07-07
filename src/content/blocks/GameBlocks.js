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
            this.setTooltip("einen Schritt vorwärts bewegen");
            this.setColour(GAME_HUE);
            this.setNextStatement(true);
            this.setPreviousStatement(true);
            this.appendDummyInput().appendField('🠶 ⭢'); // label
        }
    };
    generators['forward'] = () => `${api.FUNCTION_MOVE}(1);\n`;

    blocks['backward'] = {
        init() {
            this.setTooltip("einen Schritt rückwärts bewegen");
            this.setColour(GAME_HUE);
            this.setNextStatement(true);
            this.setPreviousStatement(true);
            this.appendDummyInput().appendField('⭠ 🠶'); // label
        }
    };
    generators['backward'] = () => `${api.FUNCTION_MOVE}(-1);\n`;

    // --------- Rotation ------------
    blocks['turn_left'] = {
        init() {
            this.setTooltip("sich um 90° nach links drehen");
            this.setColour(GAME_HUE);
            this.setNextStatement(true);
            this.setPreviousStatement(true);
            this.appendDummyInput().appendField('🠶 ⮥'); // label
        }
    };
    generators['turn_left'] = () => `${api.FUNCTION_TURN}(-90);\n`;

    blocks['turn_right'] = {
        init() {
            this.setTooltip("sich um 90° nach rechts drehen");
            this.setColour(GAME_HUE);
            this.setNextStatement(true);
            this.setPreviousStatement(true);
            this.appendDummyInput().appendField('🠶 ⮧'); // label
        }
    };
    generators['turn_right'] = () => `${api.FUNCTION_TURN}(90);\n`;

    // --------- DEBUG -----------
    blocks['debug_log'] = {
        init() {
            this.setTooltip("Logs the given variable to the Debug Log at the bottom.");
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

          /*  [{"src":"/sprites/COLLECTIBLE.png","width":22,"height":22, "alt":"crystal"}, api.PARAM_COLLECTIBLE],
            [{"src":"/sprites/TILE_NEUTRAL.png","width":22,"height":22, "alt":"floor"},api.PARAM_FLOOR],
            [{"src":"/sprites/TILE_PIT.png","width":22,"height":22, "alt":"pit"},api.PARAM_PIT],
            [{"src":"/sprites/TILE_BLUE.png","width":22,"height":22, "alt":"blue"},api.PARAM_BLUE],
            [{"src":"/sprites/TILE_GREEN.png","width":22,"height":22, "alt":"green"},api.PARAM_GREEN],
            [{"src":"/sprites/TILE_YELLOW.png","width":22,"height":22, "alt":"yellow"},api.PARAM_YELLOW],
            [{"src":"/sprites/TILE_RED.png","width":22,"height":22, "alt":"red"},api.PARAM_RED]*/
        ["crystal", api.PARAM_COLLECTIBLE], ["trap", api.PARAM_TRAP],
        ["enemy color", api.PARAM_ENEMY_COLOR], ["enemy", api.PARAM_ENEMY],
        ["green", api.PARAM_GREEN], ["blue", api.PARAM_BLUE],
        ["pit", api.PARAM_PIT], ["floor", api.PARAM_FLOOR],
    ];

    blocks['sensor_camera'] = {
        init() {
            this.appendDummyInput()
                .appendField("📷 sees")
                .appendField(new Blockly.FieldDropdown(tileTypeEnum), "tile_type");
            this.setInputsInline(true);
            this.setOutput(true, "Boolean");
            this.setColour(GAME_HUE);
            this.setTooltip("Nutze die Kamera um die Kachel vor dem Roboter zu unteruschen.");
        }
    };
    generators['sensor_camera'] = (block) => {
        const tile_type = block.getFieldValue('tile_type');
        return [`${api.FUNCTION_SENSOR_CAMERA}("${tile_type}")`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    };

    blocks['sensor_radar'] = {
        init() {
            this.appendDummyInput().appendField("📡 distance")
                .appendField(new Blockly.FieldDropdown(tileTypeEnum), "tile_type");
            this.setInputsInline(true);
            this.setOutput(true, "Number");
            this.setColour(GAME_HUE);
            this.setTooltip("Mit dem Radar kannst du herausfinden, in welcher Entfernung sich Objekte von Interesse befinden. " +
                "Dabei bedeutet die Zahl die Anzahl Schritte, die der Roboter bräuchte, um auf das gesuchte Feld zu kommen, " +
                "wenn es einen direkten Weg gibt. Ist das Resultat -1, bedeutet es, dass sich auf dem Spielfeld kein Element " +
                "der gesuchten Art befindet.");
        }
    };
    generators['sensor_radar'] = (block) => {
        const tile_type = block.getFieldValue('tile_type');
        return [`${api.FUNCTION_SENSOR_RADAR}("${tile_type}")`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    };

}
