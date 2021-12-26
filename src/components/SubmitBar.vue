<template>
    <footer>
        <div class="status">
            <div v-if="globalStatus === ESTATUS.SUCCESS" class="success">
                <span class="icon">
                    <svg viewBox="0 0 1024 1024">
                        <path
                            d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z"
                        ></path>
                        <path
                            d="M701.866667 381.866667L448 637.866667 322.133333 512c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l149.333334 149.333333c6.4 6.4 14.933333 8.533333 23.466666 8.533334s17.066667-2.133333 23.466667-8.533334l277.333333-277.333333c12.8-12.8 12.8-32 0-44.8-14.933333-12.8-36.266667-12.8-49.066666-2.133333z"
                        ></path>
                    </svg>
                </span>
                <span class="text">编译成功</span>
            </div>
            <div v-if="globalStatus === ESTATUS.FAIL" class="fail">
                <span class="icon">
                    <svg viewBox="0 0 1024 1024">
                        <path
                            d="M896 512a384 384 0 1 0-768 0 384 384 0 0 0 768 0zM42.666667 512C42.666667 252.8 252.8 42.666667 512 42.666667s469.333333 210.133333 469.333333 469.333333-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512z m469.333333 60.330667l-140.501333 140.501333-60.330667-60.330667L451.669333 512 311.168 371.498667l60.330667-60.330667L512 451.669333l140.501333-140.501333 60.330667 60.330667L572.330667 512l140.501333 140.501333-60.330667 60.330667L512 572.330667z"
                        ></path>
                    </svg>
                </span>
                <span class="text">编译失败</span>
            </div>
        </div>
        <button v-if="globalStatus !== ESTATUS.SUCCESS" class="submit" @click="globalEV.emit('compile')">运行</button>
        <button v-else class="stop" @click="globalEV.emit('stop')">停止</button>
    </footer>
</template>

<script lang="ts">
import { globalEV, globalStatus, ESTATUS } from '@/bus'
export default {
    setup() {
        return {
            globalEV,
            globalStatus,
            ESTATUS,
        }
    },
}
</script>

<style lang="scss" scoped>
footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    border-top: 1px solid #4e8cff;
    z-index: 9;

    .status {
        float: left;
        height: 60px;
        line-height: 55px;
        font-size: 23px;
        padding-left: 30px;
        .success {
            color: #4caf50;
            fill: #4caf50;
        }
        .fail {
            color: #f44336;
            fill: #f44336;
        }
        .icon {
            vertical-align: middle;
            height: 40px;
            display: inline-block;
            padding-right: 10px;
            svg {
                width: 40px;
                height: 40px;
            }
        }

        .text {
            vertical-align: middle;
        }
    }
    button {
        background: #4e8cff;
        color: #fff;
        border: 0;
        width: 139px;
        height: 60px;
        font-size: 18px;
        float: right;
        cursor: pointer;
        &:hover {
            opacity: 0.9;
        }
    }
}
</style>
