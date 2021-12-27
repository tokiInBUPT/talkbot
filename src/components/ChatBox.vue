<template>
    <div class="chat-wrapper">
        <chat-window
            class="chat-window"
            :message-list="chatData"
            :on-user-input-submit="onSubmit"
            :participants="participants"
            title="聊天窗口"
            :is-open="true"
            :show-emoji="false"
            :show-emoji-in-text="false"
            :show-file="false"
            :show-confirmation-deletion="false"
            confirmation-deletion-message=""
            :show-header="true"
            placeholder="要和机器人说点啥？"
            show-typing-indicator=""
            :colors="{
                header: {
                    bg: '#4e8cff',
                    text: '#ffffff',
                },
                launcher: {
                    bg: '#4e8cff',
                },
                messageList: {
                    bg: '#ffffff',
                },
                sentMessage: {
                    bg: '#4e8cff',
                    text: '#ffffff',
                },
                receivedMessage: {
                    bg: '#eaeaea',
                    text: '#222222',
                },
                userInput: {
                    bg: '#f4f7f9',
                    text: '#565867',
                },
            }"
            :always-scroll-to-bottom="false"
            :message-styling="false"
        >
            <template v-slot:header>
                <slot name="header"> </slot>
            </template>
            <template v-slot:user-avatar="scopedProps">
                <slot name="user-avatar" :user="scopedProps.user" :message="scopedProps.message"> </slot>
            </template>
            <template v-slot:text-message-body="scopedProps">
                <slot
                    name="text-message-body"
                    :message="scopedProps.message"
                    :messageText="scopedProps.messageText"
                    :messageColors="scopedProps.messageColors"
                    :me="scopedProps.me"
                >
                </slot>
            </template>
            <template v-slot:system-message-body="scopedProps">
                <slot name="system-message-body" :message="scopedProps.message"> </slot>
            </template>
            <template v-slot:text-message-toolbox="scopedProps">
                <slot name="text-message-toolbox" :message="scopedProps.message" :me="scopedProps.me"> </slot>
            </template>
        </chat-window>
    </div>
</template>

<script lang="ts">
import { chatData, globalEV } from '@/bus'
import { TextMessage } from '@/lib/chatbox/typing'
import ChatWindow from 'vue3-beautiful-chat/src/ChatWindow.vue'
export default {
    components: { ChatWindow },
    setup() {
        async function onSubmit(message: TextMessage) {
            chatData.value.push(message)
            globalEV.emit('input', message.data.text)
        }
        return {
            chatData,
            onSubmit,
            participants: [
                {
                    id: 'bot',
                    name: ' ',
                    imageUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii00NzQ5LjQ4IC01MDIwIDM1LjAzNiAzNS4wMzYiPjxkZWZzPjxjbGlwUGF0aCBpZD0iYSI+PHBhdGggZD0iTTAtMzk5LjQ3OWgxNy41NTV2MTcuNTU1SDB6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDM5OS40NzkpIiBmaWxsPSJub25lIi8+PC9jbGlwUGF0aD48L2RlZnM+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ4ODYgLTUwNzUpIj48Y2lyY2xlIGN4PSIxNy41MTgiIGN5PSIxNy41MTgiIHI9IjE3LjUxOCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM2LjUyIDU1KSIgZmlsbD0iIzRlOGNmZiIvPjxnIGNsaXAtcGF0aD0idXJsKCNhKSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQ1LjEzIDY0KSI+PHBhdGggZD0iTTE3LjU1NSA4Ljc3OEE4Ljc3OCA4Ljc3OCAwIDAgMCA4Ljc3NyAwIDguNzc4IDguNzc4IDAgMCAwLS4wMDEgOC43NzhhOC43NDUgOC43NDUgMCAwIDAgMi4yNiA1Ljg3OXYxLjQ0MmMwIC44LjQ5MiAxLjQ1NyAxLjEgMS40NTdoNS44M2EuODQzLjg0MyAwIDAgMCAuMTgzLS4wMiA4Ljc3OCA4Ljc3OCAwIDAgMCA4LjE4NC04Ljc1NyIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0zLjE2MSA4LjkyMUE5LjI5MiA5LjI5MiAwIDAgMSA5LjU0MS4wMzMgOC43NjMgOC43NjMgMCAwIDAgOC43NzggMCA4Ljc3NCA4Ljc3NCAwIDAgMCAwIDguNzc4IDkuNTA4IDkuNTA4IDAgMCAwIDIuMjI0IDE0LjdjLjAwNSAwIDAgLjAwOSAwIC4wMS0uMzExLjM1Mi0xLjkyNCAyLjg0OS4wMjEgMi44NDloMi4yNWMtMS4yMy0uMDIyIDEuMjYzLTIuMTA3LjI2OS0zLjQ5NGE4LjIyNSA4LjIyNSAwIDAgMS0xLjYtNS4xNDEiIGZpbGw9IiNlZmY0ZjkiLz48L2c+PC9nPjwvc3ZnPg==`,
                },
                {
                    id: 'user',
                    name: ' ',
                    imageUrl: '',
                },
            ],
        }
    },
}
</script>
<style lang="scss" scoped>
.chat-window {
    box-shadow: none;
    position: absolute;
    top: 0;
    width: 500px;
    right: 0;
    bottom: 280px;
    height: auto;
    max-height: none;
    border-radius: 0;
    &::v-deep(.sc-user-input) {
        border-radius: 0;
    }
    &::v-deep(.sc-header) {
        border-radius: 0;
        box-shadow: none !important;
        padding-left: 15px;
        min-height: 0;
        height: 40px;
        .sc-header--title {
            cursor: default;
            box-shadow: none !important;
            padding: 0;
            height: 40px;
            line-height: 40px;
            font-size: 16px;
        }
    }

    &::v-deep(.sc-message) {
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        box-sizing: border-box;
    }
    &::v-deep(*) {
        word-break: break-word;
    }
}
</style>
