<template>
    <monaco-editor
        :value="code"
        class="editor"
        language=""
        fontFamily="'Sarasa Term SC',Consolas,微软雅黑"
        @input="code = $event"
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
    width: 100%;
    height: 100vh;
    overflow: hidden;
    font-family: 'Sarasa Term SC', Consolas, 微软雅黑;
    &::v-deep(.monaco-editor) {
        .editor-widget.suggest-widget {
            display: none;
        }
        .view-lines {
            font-family: 'Sarasa Term SC', Consolas, 微软雅黑 !important;
        }
    }
}
</style>
