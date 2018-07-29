<template>
    <scroll class="listview"
            :data="data"
            ref="listview"
            :listenScroll="listenScroll"
            @scroll="scroll"
            :probeType="probeType">
        <ul>
            <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="item in group.items"
                        :key="item.id"
                        class="list-group-item"
                        @click="select(item)"
                        >
                        <img v-lazy="item.avatar" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut">
            <ul>
                <li @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" :data-index="index" v-for="(item, index) in shortcutList" :key="index" class="item" :class="{'current':currentIndex===index}">{{item}}</li>
            </ul>
        </div>
        <div class="list-fixed" v-show="this.scrollY<0" ref="fixed">
            <div class="fixed-title">{{fixedTitle}}</div>
        </div>
        <div class="loading-container" v-show="!data.length">
            <loading></loading>
        </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
    import Scroll from 'base/scroll/scroll'
    import {getData} from 'common/js/dom'
    import Loading from 'base/loading/loading'

    const TOUCH_HETGHT = 18
    const FIXEDTOP_HETGHT = 29

    export default {
        data() {
            return {
                scrollY: -1,
                currentIndex: 0,
                diff: -1
            }
        },
        created() {
            this.touch = {}
            this.listenScroll = true
            this.listHeight = []
            this.probeType = 3
        },
        props: {
            data: {
                type: Array,
                default: null
            }
        },
        methods: {
            refresh() {
                this.$refs.listview.refresh()
            },
            // 派发点击事件
            select(item) {
                this.$emit('select', item)
            },
            // 点击事件
            onShortcutTouchStart(e) {
                let touchIndex = getData(e.target, 'index')
                let firstTouch = e.touches[0]
                this.touch.y1 = firstTouch.pageY
                this.touch.touchIndex = touchIndex
                this._scrollTo(touchIndex)
            },
            // 移动事件
            onShortcutTouchMove(e) {
                let firstTouch = e.touches[0]
                this.touch.y2 = firstTouch.pageY
                let delta = Math.floor((this.touch.y2 - this.touch.y1) / TOUCH_HETGHT)
                let touchIndex = parseInt(this.touch.touchIndex) + delta
                this._scrollTo(touchIndex)
            },
            // 获取scroll的Y值
            scroll(pos) {
                this.scrollY = pos.y
            },
            // 计算滚动dom的高度
            _calculateHeight() {
                this.listHeight = []
                let list = this.$refs.listGroup
                let height = 0
                this.listHeight.push(height)

                for (let i = 0; i < list.length; i++) {
                    let item = list[i]
                    height += item.clientHeight
                    this.listHeight.push(height)
                }
            },
            // 滚动函数
            _scrollTo(index) {
                if (!index && index !== 0) {
                    return
                }
                if (index < 0) {
                    index = 0
                } else if (index > this.listHeight.length - 2) {
                    index = this.listHeight.length - 2
                }
                // 手动设置scrollY
                this.scrollY = -this.listHeight[index]
                this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
            }
        },
        watch: {
            data() {
                setTimeout(() => {
                    this._calculateHeight()
                }, 20)
            },
            scrollY(newY) {
                const listHeight = this.listHeight
                // 滚动到列表顶部
                if (newY > 0) {
                    this.currentIndex = 0
                    return
                }
                // 在中间滚动
                for (let i = 0; i < listHeight.length - 1; i++) {
                    let height1 = listHeight[i]
                    let height2 = listHeight[i + 1]
                    if (-newY >= height1 && -newY < height2) {
                        this.currentIndex = i
                        this.diff = height2 + newY
                        return
                    }
                }
                // 滚动到列表底部，且-newY大于最后一个元素的上限
                this.currentIndex = listHeight.length - 2
            },
            diff(newVal) {
                let fixedTop = (newVal > 0 && newVal < FIXEDTOP_HETGHT) ? newVal - FIXEDTOP_HETGHT : 0
                if (this.fixedTop === fixedTop) {
                    return
                }
                this.fixedTop = fixedTop
                this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
            }
        },
        computed: {
            // 填充快速入口
            shortcutList() {
                return this.data.map((group) => {
                    return group.title.substring(0, 1)
                })
            },
            fixedTitle() {
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
            }
        },
        components: {
            Scroll,
            Loading
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-heightLight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: -1px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-heightLight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
