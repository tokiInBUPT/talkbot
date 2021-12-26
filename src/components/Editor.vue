<template>
    <monaco-editor
        :value="code"
        class="editor"
        language="javascript"
        :options="{
            fontFamily: `'Sarasa Term SC',Consolas,微软雅黑`,
        }"
        @change="code = $event"
    />
</template>

<script>
import { h } from 'vue'
import { code } from '@/bus'
import MonacoEditor from 'vue-monaco'
MonacoEditor.render = () => h('div')

export default {
    components: {
        MonacoEditor,
    },
    setup() {
        return {
            code,
        }
    },
}
</script>
<style lang="scss" scoped>
.editor {
    border-right: 1px solid #4e8cff;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 60px);
    overflow: hidden;
    font-family: 'Sarasa Term SC', Consolas, 微软雅黑;
    &::v-deep(.monaco-editor) {
        .editor-widget.suggest-widget {
            display: none;
        }
    }
}
</style>
