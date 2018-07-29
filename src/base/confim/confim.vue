<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showflag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{title}}</p>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{cancelBtn}}</div>
            <div @click="confim" class="operate-btn">{{confimBtn}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        showflag: false
      }
    },
    props: {
      title: {
        type: String,
        default: '请确认'
      },
      cancelBtn: {
        type: String,
        default: '取消'
      },
      confimBtn: {
        type: String,
        default: '确认'
      }
    },
    methods: {
      show() {
        this.showflag = true
      },
      hide() {
        this.showflag = false
      },
      cancel() {
        this.hide()
        this.$emit('cancel')
      },
      confim() {
        this.hide()
        this.$emit('confim')
      }
    }
}
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .confirm
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 998
    background-color: $color-background-d
    &.confirm-fade-enter-active
      animation: confirm-fadein 0.3s
      .confirm-content
        animation: confirm-zoom 0.3s
    .confirm-wrapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      .confirm-content
        width: 270px
        border-radius: 13px
        background: $color-heightLight-background
        .text
          padding: 19px 15px
          line-height: 22px
          text-align: center
          font-size: $font-size-large
          color: $color-text-l
        .operate
          display: flex
          align-items: center
          text-align: center
          font-size: $font-size-large
          .operate-btn
            flex: 1
            line-height: 22px
            padding: 10px 0
            border-top: 1px solid $color-background-d
            color: $color-text-d
            &.left
              border-right: 1px solid $color-background-d

  @keyframes confirm-fadein
    0%
      opacity: 0
    100%
      opacity: 1

  @keyframes confirm-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>