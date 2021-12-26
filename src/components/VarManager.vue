<template>
    <aside>
        <div class="header">
            <span>变量编辑器</span>
            <small>修改后将在下条指令执行时生效</small>
            <button @click="addVar">添加</button>
        </div>
        <div class="body">
            <div class="var-list">
                <div v-for="(item, index) in varList" :key="index" class="var-item">
                    <input v-model="item.key" type="text" placeholder="Key" class="var-key" />
                    <input v-model="item.value" type="text" placeholder="Value" class="var-value" />
                    <button class="var-delete" @click="deleteVar(item)">删</button>
                </div>
            </div>
        </div>
    </aside>
</template>

<script lang="ts">
import { varList } from '@/bus'
import { IVarItem } from '@/lib/runner/index'
export default {
    setup() {
        function addVar() {
            varList.value.push({
                key: '',
                value: '',
            })
        }
        function deleteVar(item: IVarItem) {
            varList.value.splice(varList.value.indexOf(item), 1)
        }
        return {
            varList,
            addVar,
            deleteVar,
        }
    },
}
</script>

<style lang="scss" scoped>
aside {
    width: 500px;
    position: absolute;
    bottom: 60px;
    right: 0;
    height: 220px;
    box-sizing: border-box;
    * {
        vertical-align: top;
    }
    .header {
        height: 40px;
        background: #4e8cff;
        color: #fff;
        line-height: 40px;
        padding: 0 15px;
        & > * {
            padding-right: 7px;
        }
        small {
            font-size: 12px;
            opacity: 0.7;
            display: inline-block;
        }
        button {
            float: right;
            margin-top: 5px;
            height: 30px;
            width: 50px;
            background: #fff;
            border: 0;
            color: #4e8cff;
            cursor: pointer;
            &:hover {
                opacity: 0.8;
            }
        }
    }
    .body {
        height: 180px;
        overflow-y: scroll;
        padding: 10px;
        box-sizing: border-box;

        input,
        button {
            height: 25px;
            box-sizing: border-box;
        }
        input {
            border: 0;
            border-bottom: 1px solid #4e8cff;
            width: calc(50% - 25px);
            outline: 0;
        }
        button {
            width: 50px;
            background: #4e8cff;
            border: 0;
            color: #fff;
            cursor: pointer;
            &:hover {
                opacity: 0.8;
            }
        }
    }
}
</style>
