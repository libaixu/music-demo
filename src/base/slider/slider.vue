<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot>
            </slot>
        </div>
        <div class="dots">
            <div class="dot" v-for="(item, index) in dots" :key="index" :class="{active: currentPageIndex === index}"></div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default{
    // name: 'slider',
    data() {
        return {
            dots: [],
            // 正在展示的图片index
            currentPageIndex: 0
        }
    },
    props: {
        // 是否循环播放
        loop: {
            type: Boolean,
            default: true
        },
        // 自动播放
        autoPlay: {
            type: Boolean,
            default: true
        },
        // 切换时间
        interval: {
            type: Number,
            default: 4000
        }
    },
    mounted() {
        setTimeout(() => {
            this._setSliderWidth()
            this._initDots()
            this._initSlider()

            if (this.autoPlay) {
                this._play()
            }
        }, 20)

        window.addEventListener('resize', () => {
            if (!this.slider || !this.scroll.enabled) {
                return
            }

            this._setSliderWidth(true)
            this.slider.refresh()
        })
    },
    methods: {
        // 设置slider宽度
        _setSliderWidth(isResize) {
            this.children = this.$refs.sliderGroup.children
            // 图片集合总宽度
            let width = 0
            // 展示区宽度
            let sliderWidth = this.$refs.slider.clientWidth
            for (let i = 0, length = this.children.length; i < length; i++) {
                let child = this.children[i]
                addClass(child, 'slider-item')

                child.style.width = sliderWidth + 'px'
                width += sliderWidth
            }

            if (this.loop) {
                width += 2 * sliderWidth
            }

            this.$refs.sliderGroup.style.width = width + 'px'
        },
        // 初始化dots
        _initDots() {
            this.dots = new Array(this.children.length)
        },
        // 初始化滚动插件
        _initSlider() {
            this.slider = new BScroll(this.$refs.slider, {
                scrollX: true,
                scrollY: false,
                momentum: false,
                // 支持循环轮播属性
                snap: {
                    loop: this.loop,
                    threshold: 0.3,
                    speed: 400
                }
            })

            // 维护 currentPageIndex
            this.slider.on('scrollEnd', () => {
                let pageIndex = this.slider.getCurrentPage().pageX

                this.currentPageIndex = pageIndex
                if (this.autoPlay) {
                  this._play()
                }
            })

            this.slider.on('beforeScrollStart', () => {
              if (this.autoPlay) {
                clearTimeout(this.timer)
              }
            })
        },

        // 自动播放
        _play() {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
              this.slider.next()
          }, this.interval)
        }
    },
    activated() {
        this.slider.enable()
        let pageIndex = this.slider.getCurrentPage().pageX
        this.slider.goToPage(pageIndex, 0, 0)
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
            this._play()
        }
    },
    deactivated() {
        this.slider.disable()
        clearTimeout(this.timer)
    },
    destroyed() {
      this.slider.disable()
      clearTimeout(this.timer)
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '~common/stylus/variable'

    .slider
        min-height: 1px
        position: relative
        .slider-group
            overflow: hidden
            white-space: nowrap
            .slider-item
                float: left
                box-sizing: border-box
                overflow: hidden
                text-align: center
                a
                    display: block
                    width: 100%
                    overflow: hidden
                    text-decoration: none
                    img
                        display: block
                        width: 100%
        .dots
            position: absolute
            right: 0
            left: 0
            bottom: 12px
            text-align: center
            font-size: 0
            .dot
                display: inline-block
                margin: 0 4px
                width: 8px
                height: 8px
                border-radius: 50%
                background: $color-text-l
                &.active
                    width: 20px
                    border-radius: 5px
                    background: $color-text-ll
</style>
