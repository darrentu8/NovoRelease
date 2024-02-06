<template>
    <q-dialog :model-value="isShow" @before-hide="hideDialog" persistent>
        <q-card class="text-center brand-dialog-round q-pa-lg no-scroll" :style="{ 'min-width': $q.platform.is.mobile ? '60%' : '250px' }">
            <q-card-section v-if="title" class="row flex justify-center items-center">
              <div class="text-h6">{{ title }}</div>
            </q-card-section>
            <q-card-section v-if="props.progressVal === 1" class="row flex justify-center items-center q-pb-none">
              <q-icon name="check_circle_outline" color="primary" :size="!$q.platform.is.mobile ? '3vw' : '36px'" />
            </q-card-section>
            <q-card-section v-if="props.progressVal < 1" class="q-py-xs row flex justify-center items-center">
              <q-spinner-gears
                color="primary"
                size="6em"
              />
            </q-card-section>
            <q-card-section v-if="message" class="row flex justify-center items-center">
              <div class="text-h6">{{ message }}</div>
            </q-card-section>
            <q-card-section v-if="props.progressVal < 1" class="row q-pb-sm items-center">
                <q-linear-progress animation-speed="300" rounded size="15px" :value="props.progressVal" color="primary" class="q-mt-sm brand-round">
                <div class="absolute-full flex flex-center">
                  <q-badge color="transparent" text-color="white" :label="Math.round((props.progressVal * 100)) + '%'" />
                </div>
                </q-linear-progress>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { watch } from 'vue'
// import { usePlaylistStore } from 'src/stores/playlist'

const props = defineProps(['isShow', 'progress', 'title', 'message', 'progressVal'])
const emit = defineEmits(['update:isShow'])

// const playlistStore = usePlaylistStore()

watch(() => props.progressVal, (newPercentCompleted) => {
  // console.log('props.progressVal', props.progressVal)
})

const hideDialog = () => {
    emit('update:isShow', false)
}

</script>
<style lang="scss" scoped></style>
