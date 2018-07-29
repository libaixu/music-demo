<template>
  <scroll class="suggest"
          ref="scroll"
          @scrollToEnd="scrollToEnd"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDesPlayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!result.length && !hasMore" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import { getSearchResult } from 'api/search'
  import { ERR_OK } from 'api/config'
  import { creatSong } from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import { getSongVkey } from 'api/singer'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import { mapMutations, mapActions } from 'vuex'
  import NoResult from 'base/noresult/noresult'

  const TYPE_SINGER = 'singer'
  const PAGES = 20

  export default {
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        hasMore: true,
        beforeScroll: true
      }
    },
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    watch: {
      query() {
        if (this.query) {
          this._getSearchResult()
        }
      }
    },
    methods: {
      // 获取数据
      _getSearchResult() {
        this.hasMore = true
        this.page = 1
        getSearchResult(this.query, this.page, this.showSinger, PAGES).then((res) => {
          if (res.code === ERR_OK) {
            // this.result = this._genResult(res.data)
            if (res.data.song) {
              this.result = this._normalize(res.data)
              // this.showSinger = false
              this._checkMore(res.data, PAGES)
            }
          }
        })
      },
      // 整理数据###为了取得下发回调函数中的值，不再使用此函数###
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        return ret
      },
      _normalize(data) {
        let list = data.song.list
        let ret = []
        list.forEach((item, index) => {
          if (item.songid && item.albumid) {
            if (item.songmid) {
              getSongVkey(item.songmid).then((res) => {
                const vkey = res.data.items[0].vkey
                ret.push(creatSong(item, vkey))
                // 想取得回调函数的返回值，没办法，在这增加有歌手信息时的对象，不再使用_getResult函数
                if (list.length - 1 === index) {
                  if (data.zhida && data.zhida.singerid) {
                    ret.push({...data.zhida, ...{type: TYPE_SINGER}})
                    // 将歌手信息放到第一位
                    let indexReplace = ret.findIndex((item) => {
                      return item.type === TYPE_SINGER
                    })
                    let middle = ret[0]
                    ret[0] = ret[indexReplace]
                    ret[indexReplace] = middle
                  }
                }
              })
            }
          }
        })
        return ret
      },
      // 歌手点击事件
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.addSong(item)
        }
        this.$emit('select')
      },
      // 确定icon是歌曲还是歌手
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      // 获取歌曲名称和歌手名称
      getDesPlayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      // 上划刷新
      scrollToEnd() {
        if (!this.hasMore) {
          return
        }
        this.page++
        getSearchResult(this.query, this.page, this.showSinger, PAGES).then((res) => {
          if (res.code === ERR_OK) {
            if (res.data.song) {
              let list = res.data.song.list
              list.forEach((item) => {
                if (item.songid && item.albumid) {
                  if (item.songmid) {
                    getSongVkey(item.songmid).then((res) => {
                      const vkey = res.data.items[0].vkey
                      this.result.push(creatSong(item, vkey))
                    })
                  }
                }
              })
              this._checkMore(res.data, PAGES)
            }
          }
        })
      },
      _checkMore(data, PAGES) {
        const song = data.song
        if (!song.list || (song.curnum + song.curpage * PAGES) >= song.totalnum) {
          this.hasMore = false
          // this.showSinger = true
        }
      },
      refresh() {
        this.$refs.scroll.refresh()
      },
      listScroll() {
        this.$emit('listScroll')
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'addSong'
      ])
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>