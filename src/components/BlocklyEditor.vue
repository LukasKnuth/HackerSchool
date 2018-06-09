<template>
    <div>
        <div id="blocklyDiv"></div>
        <xml v-pre id="toolbox" style="display: none">
            <block type="controls_if"></block>
            <block type="controls_repeat_ext"></block>
            <block type="logic_compare"></block>
            <block type="math_number"></block>
            <block type="math_arithmetic"></block>
            <block type="text"></block>
            <block type="text_print"></block>
        </xml>
    </div>
</template>

<script lang="js">
    import Blockly from "node-blockly/browser";

    export default {
        name: 'blockly-editor',
        mounted() {
            const blocklyArea = document.getElementById('blocklyArea');
            const blocklyDiv = document.getElementById('blocklyDiv');
            const workspacePlayground = Blockly.inject(blocklyDiv, {
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
            Blockly.svgResize(workspacePlayground);
        }
    };
</script>

<style lang="scss" scoped>
    #blocklyDiv {
        position: absolute;
    }
</style>