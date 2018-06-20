<template>
    <div>
        <div id="blocklyDiv"></div>
        <Toolbox>
            <ToolboxBlock v-for="block in level.getBlocks()" :key="block" :type="block"></ToolboxBlock>
        </Toolbox>
    </div>
</template>

<script lang="js">
    import Blockly from "node-blockly/browser";
    import ExportBlocks from "../../content/blocks/GameBlocks";
    import Toolbox from "./Toolbox";
    import ToolboxBlock from "./Block";

    export default {
        components: {Toolbox, ToolboxBlock},
        name: 'blockly-editor',
        props: {
            level: null
        },
        created() {
            ExportBlocks(Blockly.Blocks);
        },
        mounted() {
            const blocklyArea = document.getElementById('blocklyArea');
            const blocklyDiv = document.getElementById('blocklyDiv');
            this.workspace = Blockly.inject(blocklyDiv, {
                toolbox: document.getElementById('toolbox')
            });
            const resizeEditor = (e) => {
                // take available width provided by area
                blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
                // take available rest-height of window:
                const rect = blocklyArea.getBoundingClientRect();
                blocklyDiv.style.height = (window.innerHeight - rect.top) + 'px';
            };
            window.addEventListener('resize', resizeEditor, false);
            resizeEditor();
            Blockly.svgResize(this.workspace);
        },
        beforeUpdate() {
            // TODO reset editor, load new blocks from changed level and add them to blockly!
        },
        methods: {
            compile() {
                Blockly.JavaScript.addReservedWords('code');
                return Blockly.JavaScript.workspaceToCode(this.workspace);
            }
        }
    };
</script>

<style lang="scss" scoped>
    #blocklyDiv {
        position: absolute;
    }
</style>