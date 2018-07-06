<template>
    <div>
        <b-nav>
            <b-nav-item :disabled="!canUndo" :title="$t('editor.undoLabel')" @click="undo()">
                <font-awesome-icon icon="undo-alt" />
            </b-nav-item>
            <b-nav-item :disabled="!canRedo" :title="$t('editor.redoLabel')" @click="redo()">
                <font-awesome-icon icon="redo-alt" />
            </b-nav-item>
        </b-nav>
        <div id="blocklyDiv"></div>
    </div>
</template>

<script lang="js">
    import Blockly from "node-blockly/browser";
    import ExportBlocks from "../../content/blocks/GameBlocks";
    import {makeToolboxXML} from "./ToolboxHelper";
    import {BLOCK_EXECUTING} from "../game/Game";
    import {ACTION_CHANGE_LEVEL_PROGRESS} from "../../store/CourseProgress";

    export default {
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
            this.initEditor();
            const blocklyDiv = document.getElementById('blocklyDiv');
            const blocklyArea = document.getElementById('blocklyArea');
            const resizeEditor = (e) => {
                // take available width provided by area
                blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
                // take available rest-height of window:
                const rect = blocklyArea.getBoundingClientRect();
                // TODO magick number here is basically 150px from overlay + something. Make not magick!
                blocklyDiv.style.height = (window.innerHeight - rect.top - 200) + 'px';
            };
            window.addEventListener('resize', resizeEditor, false);
            resizeEditor();
            Blockly.svgResize(this.workspace);
        },
        beforeDestroy() {
            this.disposeEditor();
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
            },
            initEditor() {
                const blocklyDiv = document.getElementById('blocklyDiv');
                const toolbox = this.level
                    ? makeToolboxXML(this.level.getBlocks(), this.level.allowVariables, this.level.allowMethods)
                    : "";
                this.workspace = Blockly.inject(blocklyDiv, {
                    toolbox,
                    maxBlocks: this.level ? this.level.maxBlocks : Infinity
                });
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
                const progress = this.$store.getters.currentLevelProgress;
                if (progress) {
                    const xml = Blockly.Xml.textToDom(progress.workspaceData);
                    Blockly.Xml.domToWorkspace(xml, this.workspace);
                }
            },
            disposeEditor() {
                if (this.workspaceListener) {
                    this.workspace.removeChangeListener(this.workspaceListener);
                }
                this.workspace.dispose();
            }
        },
        watch: {
            level() {
                this.emitBlockCountUpdate(0);
                this.canUndo = false;
                this.canRedo = false;
                this.disposeEditor();
                this.initEditor();
            }
        }
    };
</script>

<style lang="scss" scoped>
    #blocklyDiv {
        position: absolute;
    }
</style>