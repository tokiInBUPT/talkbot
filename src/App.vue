<template>
    <main>
        <div class="left">
            <editor />
        </div>
        <div class="right">
            <chat-box />
        </div>
    </main>
</template>

<script>
import ChatBox from './components/ChatBox.vue'
import Editor from './components/Editor.vue'
export default {
    components: { Editor, ChatBox },
    setup() {
        return {}
    },
}
</script>

<style lang="scss">
html,
body,
#app {
    width: 100%;
    height: 100%;
    margin: 0;
}
</style>
<style lang="scss" scoped>
main {
    width: 100%;
    height: 100%;
}
.left {
    position: absolute;
    top: 0;
    left: 0;
    right: 500px;
    bottom: 0;
    background: #eee;
}
.right {
    width: 500px;
    height: 100%;
    padding-left: calc(100% - 500px);
}
</style>
