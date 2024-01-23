<template>
  <q-footer>
    <div class="main">Copyright © {{ new Date().getFullYear() }} Delta Electronics,Inc. All rights reserved. Version {{
      version }}
    </div>
  </q-footer>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FooterComponent',
  props: {
  },
  data() {
    return {
      title: 'vivitek',
      logo: require('../assets/img/logo/vvkLogoFooter.svg'),
      version: 'v1.0.1.68880'
    }
  }
})
</script>
<style lang="sass" scoped>
.q-footer
    width: 100%
    height: 100px
    line-height: 26px
    padding: 16px 0px
    background-color: #aaaaaa
    color: rgb(158, 156, 156)
    text-align: center
    font-size: 14px
    letter-spacing: 0.1px
    a
      text-decoration: none
    .service_link
      color: rgba(255, 255, 255, 0.38)
      text-decoration: underline
    .subTitle
      color: rgba(255, 255, 255, 0.38)
      line-height: 20px
      padding: 0px 13px
      font-size: 12px
      position: relative
    .top
      margin: 0px auto 12px
      display: flex
      -webkit-box-pack: center
      justify-content: center
      .flex
        display: flex
        align-items: flex-start
      .block.right
        padding-left: 6px
      .sub
        color: rgba(255, 255, 255, 0.77)
        display: block
        text-align: left
        line-height: 20px
        position: relative
        .img
          width: 100px
          position: relative
      .subTitle
        color: rgba(255, 255, 255, 0.38)
        line-height: 20px
        padding-left: 20px
        font-size: 12px
        position: relative
        &::after
          position: absolute
          left: 10px
          top: 0px
          content: ""
          display: block
          width: 1px
          height: 100%
          background-color: rgba(255, 255, 255, 0.38)
        &.normal
          padding-left: 20px
          display: flex
          flex-direction: column
          align-items: flex-start
          color: rgba(255, 255, 255, 0.38)
    .main
      color: white

@media (max-width: 1200px)
  .q-footer
    height: auto
    .top
      flex-wrap: wrap
      margin: 0px auto 12px
      .flex
        width: 100%
        justify-content: center
        .sub
          float: right
          width: 46%
          .img
            float: right
            margin-right: 10px
        .subTitle
          float: right
          width: 49%
      .block
        margin-top: 10px
        width: 100%
        display: flex
        -webkit-box-pack: center
        justify-content: center
        &.right
          padding-left: 0
        .sub
          margin: 0px auto
          width: 46%
          .st
            display: inline-block
            text-align: right
            width: 46%
            font-size: 12px
        .subTitle
          float: right
          width: 53%
          color: rgba(255, 255, 255, 0.38)
          line-height: 20px
          font-size: 12px
          position: relative
</style>
