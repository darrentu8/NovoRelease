<template>
    <div>
        <div>Type </div>
        <div class="row q-gutter-xs">
            <q-btn @click="changeType(strokeTypeOptions.SOLID)" class="overflow-hidden q-pa-sm" flat dense>
                <img :style="{ filter:isSolid? `drop-shadow(${color} 100px 0)`:'',  transform:isSolid? `translateX(-100px)`:''}"
                    style="height:20px;width:50px;" :src="iconSolid" />
            </q-btn>
            <q-btn @click="changeType(strokeTypeOptions.DASH)" class="overflow-hidden q-pa-sm" flat dense>
                <img :style="{ filter:isDash? `drop-shadow(${color} 100px 0)`:'',  transform:isDash? `translateX(-100px)`:''}"
                    style="height:20px;width:50px" :src="iconDash" />
            </q-btn>
            <q-btn @click="changeType(strokeTypeOptions.DASH_LONG)" class="overflow-hidden q-pa-sm" flat dense>
                <img :style="{ filter:isDashLong? `drop-shadow(${color} 100px 0)`:'',  transform:isDashLong? `translateX(-100px)`:''}"
                    style="height:20px;width:50px" :src="iconDashLong" />
            </q-btn>
        </div>
    </div>
</template>

<script>

import { strokeType } from '../helper/enum'

export default {
    name: 'StrokeType',
    props: ['strokeType', 'color'],
    data() {
        return {
            iconSolid: require('../assets/icons/icon_solid.svg'),
            iconDash: require('../assets/icons/icon_dash.svg'),
            iconDashLong: require('../assets/icons/icon_dash_long.svg'),
            strokeTypeOptions: strokeType
        }
    },
    computed: {
        isSolid() {
            return this.strokeType === strokeType.SOLID
        },
        isDash() {
            return this.strokeType === strokeType.DASH
        },
        isDashLong() {
            return this.strokeType === strokeType.DASH_LONG
        }
    },
    methods: {
        changeType(type) {
            this.$emit('update:strokeType', type)
            this.$emit('changeType', type)
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
