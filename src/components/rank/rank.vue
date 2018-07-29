<template>
    <div class="rank" ref="rank">
        <Scroll class="toplist" :data="topList" ref="scroll">
            <ul>
                <li class="item" v-for="(item, index) in topList" @click="selectItem(item)" :key="index">
                    <div class="icon">
                        <img width="100" height="100" v-lazy="item.picUrl">
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song, index) in item.songList" :key="index">
                            <span>{{index + 1}}</span>
                            <span>{{song.songname}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </Scroll>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import { getTopList } from 'api/rank'
    import Scroll from 'base/scroll/scroll'
    import { playListMixin } from 'common/js/mixin'
    import { mapMutations } from 'vuex'

    export default{
        mixins: [
            playListMixin
        ],
        data() {
            return {
                topList: []
            }
        },
        created() {
            this._getTopList()
        },
        methods: {
            selectItem(item) {
                this.$router.push({
                    path: `/rank/${item.id}`
                })
                this.setTopList(item)
            },
            // mixin函数，调整小播放器显示时scroll的botton
            handlePlayList(playList) {
                let bottom = playList.length > 0 ? '60px' : ''
                this.$refs.rank.style.bottom = bottom
                this.$refs.scroll.refresh()
            },
            // 获取数据
            _getTopList() {
                getTopList().then((res) => {
                    this.topList = res.data.topList
                })
            },
            ...mapMutations({
                setTopList: 'SET_TOPLIST'
            })
        },
        components: {
            Scroll
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
