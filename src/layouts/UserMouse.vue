<template>
    <div class="absolute" v-for="(userMouse, index) in userMouseList" :key="userMouse.userData.uid"
        :style="{ transform: `translate(${userMouse.canvasPointer.x}px, ${userMouse.canvasPointer.y}px)` }"
        v-show="(userMouse.pageId === this.page)">
        <q-icon>
            <img style=" height:24px;width:24px" :src="iconChoose" />
        </q-icon>
        <q-avatar class="absolute" style="left:100%;top:-100%;opacity:0.8;" size="md"
            :style="{ 'background-color': colorArr[index % 5] }"
            :text-color="getLuminosity(colorArr[index % 5]) > 0.5 ? 'black' : 'white'">
            <q-img v-if="getAvatar(userMouse.userData.uid)" spinner-color="green" spinner-size="20px"
                :src="getAvatar(userMouse.userData.uid)" />
            <span v-else> {{ avatarName(userMouse.userData.fname, userMouse.userData.lname) }}</span>
            <q-tooltip>
                {{ userMouse.userData.fname }} {{ userMouse.userData.lname }}
            </q-tooltip>
        </q-avatar>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { colors } from 'quasar'

const { luminosity } = colors

export default {
    name: 'User-Mouse',
    mounted() {
        this.$bus.on('updateUserMouses', this.updateUserMouses)
        this.$bus.on('clearUserMouses', this.clearUserMouses)
    },
    beforeUnmount() {
        this.$bus.off('updateUserMouses', this.updateUserMouses)
        this.$bus.off('clearUserMouses', this.clearUserMouses)
    },
    data() {
        return {
            iconChoose: require('../assets/icons/icon_cursor.svg'),
            colorArr: ['#5F5F5F', '#59C0E6', '#E89227', '#efd640', '#a840ef'],
            userMouses: []
        }
    },
    computed: {
        userMouseList() {
            return this.userMouses.filter(userMouse =>
                this.$store.state.user.userList.findIndex(o => o.uid === userMouse.userData.uid) >= 0)
            // return this.$store.state.common.userMouseList.filter(userMouse =>
            //     this.$store.state.user.userList.findIndex(o => o.uid === userMouse.userData.uid) >= 0)
        },
        page() {
            return this.$store.state.common.page
        }
    },
    methods: {
        ...mapMutations('common', ['']),
        updateUserMouses(userMouse) {
            const index = this.userMouses.findIndex(o => o.userData.uid === userMouse.userData.uid)
            if (index >= 0) {
                this.userMouses[index] = userMouse
            } else {
                this.userMouses.push(userMouse)
            }
        },
        clearUserMouses() {
            this.userMouses = []
        },
        avatarName(fname, lname) {
            const f = fname.charAt(0).toUpperCase()
            const l = lname.charAt(0).toUpperCase()
            return f + l
        },
        getLuminosity(color) {
            return luminosity(color)
        },
        getAvatar(uid) {
            const user = this.$store.state.user.userList.find(o => o.uid === uid)
            if (user) {
                return user.thumbnail
            } else {
                return null
            }
        }
    }
}
</script>
<style lang="scss">

</style>
