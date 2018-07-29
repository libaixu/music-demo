<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" ref="playBtn" v-show="songs.length">
        <div class="play" @click="playRandomClick">
          <i class="icon-play"></i>
          <span class="text">随机播放所有歌曲</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data:="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <SongList :rank="rank" @select="selectItem" :songs="songs"></SongList>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmacript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import { profixStyle } from 'common/js/dom'
  import Loading from 'base/loading/loading'
  import { mapActions } from 'vuex'
  import { playListMixin } from 'common/js/mixin'

  const transform = profixStyle('transform')
  const backdrop = profixStyle('backdrop-filter')

  const TOP_HEIGHT = 40

  export default {
    mixins: [playListMixin],
    data() {
      return {
        scrollY: 0
      }
    },
    props: {
      title: {
        type: String,
        defaule: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: () => []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImage})`
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    methods: {
      // mixin函数，在有小播放器的情况下刷新scroll高度
      handlePlayList(playList) {
        let bottom = playList.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      // 随机播放全部
      playRandomClick() {
        this.playRandom({
          list: this.songs
        })
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      // 接受song-list组件派发的点击事件
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      ...mapActions([
        'selectPlay',
        'playRandom'
      ])
    },
    watch: {
      scrollY(newY) {
        let maxTranslate = Math.max(this.transLateY, newY)
        this.$refs.bgLayer.style[transform] = `translate3d(0, ${maxTranslate}px, 0)`
        // this.$refs.bgLayer.style['webkitTransform'] = `translate3d(0, ${maxTranslate}px, 0)`
        let zIndex = 0
        let scale = 1
        let blur = 0

        const percent = Math.abs(newY / this.imageHeight)
        if (newY > 0) {
          scale = 1 + percent
          zIndex = 1
        } else {
          blur = Math.max(20 * percent, 20)
        }
        // 针对ios的增强
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        // this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
        if (newY < this.transLateY) {
          zIndex = 1
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${TOP_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else if (newY > this.transLateY) {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = 'block'
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        // this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
      }
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.transLateY = -this.imageHeight + TOP_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    components: {
      Scroll,
      SongList,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
