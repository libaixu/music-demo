<template>
  <div class="progress-bar" ref="progressBar" @click="clickProgress">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
            @touchstart="progressTouchStart"
            @touchmove="progressTouchMove"
            @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { profixStyle } from 'common/js/dom'

  const btnWidth = 16
  const transform = profixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      // touchstart
      progressTouchStart(e) {
        this.touch.initnal = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      // touchmove
      progressTouchMove(e) {
        if (!this.touch.initnal) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - btnWidth, Math.max(0, deltaX + this.touch.left))
        this._offset(offsetWidth)
      },
      // touchend
      progressTouchEnd() {
        this.touch.initnal = false
        this._triggerPercent()
      },
      // 派发进度条百分比事件
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth
        const progressWidth = this.$refs.progress.clientWidth
        const percent = progressWidth / barWidth
        this.$emit('percentChange', percent)
      },
      // 点击进度条事件
      clickProgress(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 使用offsetX时,当点击btn的时候btn会跳回开始部分
        // this._offset(e.offsetX)
        this._triggerPercent()
      },
      // 设置进度条
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      }
    },
    watch: {
      percent(newPercent) {
        if (newPercent > 0 && !this.touch.initnal) {
          const barWidth = this.$refs.progressBar.clientWidth - btnWidth
          const offsetWidth = newPercent * barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>