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
                    name: '萝卜',
                    imageUrl: '',
                },
                {
                    id: 'user',
                    name: '用户',
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
        padding: 0 15px;
        box-sizing: border-box;
    }
    &::v-deep(*) {
        word-break: break-word;
    }
}
</style>
