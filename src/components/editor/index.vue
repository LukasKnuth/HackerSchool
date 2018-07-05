<template>
    <div>
        <b-nav>
            <b-nav-item :disabled="!canUndo" @click="undo()">{{$t("editor.undoLabel")}}</b-nav-item>
            <b-nav-item :disabled="!canRedo" @click="redo()">{{$t("editor.redoLabel")}}</b-nav-item>
        </b-nav>
        <div id="blocklyDiv"></div>
        <Toolbox>
            <ToolboxCategory v-for="(blocks, category) in level.getBlocks()" :name="category">
                <ToolboxBlock v-for="block in blocks" :key="block" :type="block"></ToolboxBlock>
            </ToolboxCategory>
            <ToolboxCategory v-if="allowVariables" name="Variables" custom="VARIABLE">
                <ToolboxButton title="New Variable" callbackKey="newVariable"></ToolboxButton>
            </ToolboxCategory>
            <ToolboxCategory v-if="allowMethods" name="Functions" custom="PROCEDURE"></ToolboxCategory>
        </Toolbox>
    </div>
</template>

<script lang="js">
    import Blockly from "node-blockly/browser";
    import ExportBlocks from "../../content/blocks/GameBlocks";
    import Toolbox from "./Toolbox";
    import ToolboxBlock from "./Block";
    import ToolboxCategory from "./Category";
    import ToolboxButton from "./Button";
    import {BLOCK_EXECUTING} from "../game/Game";
    import {ACTION_CHANGE_LEVEL_PROGRESS} from "../../store/CourseProgress";

    export default {
        components: {Toolbox, ToolboxBlock, ToolboxCategory, ToolboxButton},
        name: 'blockly-editor',
        props: {
            level: null
        },
        data() {
            return {
                canUndo: false,
                canRedo: false
            };
        },
        created() {
            ExportBlocks(Blockly.Blocks, Blockly.JavaScript);
        },
        mounted() {
            const blocklyArea = document.getElementById('blocklyArea');
            const blocklyDiv = document.getElementById('blocklyDiv');
            this.workspace = Blockly.inject(blocklyDiv, {
                toolbox: document.getElementById('toolbox'),
                maxBlocks: this.level ? this.level.maxBlocks : Infinity
            });
            const resizeEditor = (e) => {
                // take available width provided by area
                blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
                // take available rest-height of window:
                const rect = blocklyArea.getBoundingClientRect();
                blocklyDiv.style.height = (window.innerHeight - rect.top - 60) + 'px';
            };
            window.addEventListener('resize', resizeEditor, false);
            resizeEditor();
            Blockly.svgResize(this.workspace);
            this.workspaceListener = this.workspace.addChangeListener((event) => {
                this.canUndo = this.workspace.undoStack_.length > 0;
                this.canRedo = this.workspace.redoStack_.length > 0;
                if (event.type === Blockly.Events.BLOCK_CREATE || event.type === Blockly.Events.BLOCK_DELETE) {
                    this.emitBlockCountUpdate(this.workspace.getAllBlocks().length);
                }
                // Store state:
                if (event.type !== Blockly.Events.UI) {
                    // TODO this is triggered when workspace.clear() is called and saves empty progress. Workaround?
                    const xml = Blockly.Xml.workspaceToDom(this.workspace);
                    const xmlText = Blockly.Xml.domToText(xml);
                    this.$store.dispatch(ACTION_CHANGE_LEVEL_PROGRESS, {
                        workspaceData: xmlText
                    });
                }
            });
            this.workspace.registerButtonCallback("newVariable", this.newVariable.bind(this));
        },
        beforeDestroy() {
            if (this.workspaceListener) {
                this.workspace.removeChangeListener(this.workspaceListener);
            }
            this.workspace.dispose();
        },
        computed: {
            allowVariables() {
                return this.level ? this.level.allowVariables : false;
            },
            allowMethods() {
                return this.level ? this.level.allowMethods : false;
            }
        },
        methods: {
            compile() {
                Blockly.JavaScript.addReservedWords('code');
                Blockly.JavaScript.STATEMENT_PREFIX = `${BLOCK_EXECUTING}(%1);\n`;
                Blockly.JavaScript.addReservedWords(BLOCK_EXECUTING);
                return Blockly.JavaScript.workspaceToCode(this.workspace);
            },
            highlightBlock(blockId) {
                if (this.workspace) {
                    this.workspace.highlightBlock(blockId);
                }
            },
            newVariable(button) {
                Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), null, "any");
            },
            undo() {
                this.workspace.undo(false);
            },
            redo() {
                this.workspace.undo(true);
            },
            emitBlockCountUpdate(blockCount) {
                this.$emit("update:blocks", blockCount);
            }
        },
        watch: {
            level(newVal, oldVal) {
                // New blocks are already loaded in the template, reset everything:
                this.workspace.clear();
                this.emitBlockCountUpdate(0);
                this.workspace.clearUndo();
                this.workspace.options.maxBlocks = newVal.maxBlocks;
                // Load workspace data
                const progress = this.$store.getters.currentLevelProgress;
                if (progress) {
                    const xml = Blockly.Xml.textToDom(progress.workspaceData);
                    Blockly.Xml.domToWorkspace(xml, this.workspace);
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    #blocklyDiv {
        position: absolute;
    }
</style>