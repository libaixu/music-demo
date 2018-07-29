<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
            <scroll :refreshDelay="refreshDelay" class="shortcut" :data="shotcut" ref="shortcut">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey" :key="index">
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="showConfim">
                                <i class="icon-clear"></i>
                            </span>
                        </h1>
                        <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest @select="saveSearch" @listScroll="blurInput" :query="query" ref="suggest"></suggest>
        </div>
        <confim ref="confim" title="确认清空搜索记录么" confimBtn="清空" @confim="clearSearchHistory"></confim>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import { getHotMusic } from 'api/search'
import { ERR_OK } from 'api/config'
import Suggest from 'components/suggest/suggest'
import { playListMixin, searchMixin } from 'common/js/mixin'
import { mapActions } from 'vuex'
import SearchList from 'base/search-list/search-list'
import Confim from 'base/confim/confim'
import Scroll from 'base/scroll/scroll'

export default{
    mixins: [playListMixin, searchMixin],
    data() {
        return {
            hotKey: []
        }
    },
    computed: {
        shotcut() {
            return this.hotKey.concat(this.searchHistory)
        }
    },
    created() {
        this._getHotMusic()
    },
    watch: {
        query(newQuery) {
            if (!newQuery) {
                setTimeout(() => {
                    this.$refs.shortcut.refresh()
                }, 20)
            }
        }
    },
    methods: {
        // mixin函数，在有小播放器的情况下刷新scroll高度
        handlePlayList(playList) {
            let bottom = playList.length > 0 ? '60px' : ''
            this.$refs.shortcutWrapper.style.bottom = bottom
            this.$refs.shortcut.refresh()
            this.$refs.searchResult.style.bottom = bottom
            this.$refs.suggest.refresh()
        },
        showConfim() {
            this.$refs.confim.show()
        },
        // 获取数据
        _getHotMusic() {
            getHotMusic().then((res) => {
                if (res.code === ERR_OK) {
                    this.hotKey = res.data.hotkey.slice(0, 10)
                }
            })
        },
        // /*点击事件携带参数是其本身，且不做其他处理
        // *可以直接将action函数绑定到组件上，不必像下边这样处理
        // *删除一条数据，包括本地数据
        // *deleteOne(item) {
        // *   this.deleteSearchHistory(item)
        // *},
        // *删除所有搜索数据
        // *clearAll() {
        // *   this.clearSearchHistory()
        // *},
        // */
        ...mapActions([
            'clearSearchHistory'
        ])
    },
    components: {
        SearchBox,
        Suggest,
        SearchList,
        Confim,
        Scroll
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-heightLight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
