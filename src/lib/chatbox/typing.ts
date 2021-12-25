/**
 * vue3-beautiful-message库的消息格式定义
 */
export interface TextMessage {
    author: string
    type: 'text'
    data: {
        text: string
    }
}
