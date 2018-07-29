<template>
    <div class="singer" ref="singer">
        <listview :data="this.singers" @select="selectSinger" ref="list"></listview>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import Listview from 'base/listview/listview'
import { mapMutations } from 'vuex'
import { playListMixin } from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default{
    mixins: [playListMixin],
    data() {
        return {
            singers: []
        }
    },
    created() {
        this._getSingerList()
    },
    methods: {
        // mixin函数，在有小播放器的情况下刷新scroll高度
        handlePlayList(playList) {
            let bottom = playList.length > 0 ? '60px' : ''
            this.$refs.singer.style.bottom = bottom
            this.$refs.list.refresh()
        },
        // 接受点击事件
        selectSinger(singer) {
            this.$router.push({
                path: `/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
        // 获取数据
        _getSingerList() {
            getSingerList().then((res) => {
                if (res.code === ERR_OK) {
                    this.singers = this.nomalize(res.data.list)
                }
            })
        },
        // 处理数据，获得想要的数据
        nomalize(list) {
            let map = {
                hot: {
                    title: HOT_NAME,
                    items: []
                }
            }
            list.forEach((item, index) => {
                if (index < HOT_SINGER_LEN) {
                    map.hot.items.push(new Singer({
                        id: item.Fsinger_mid,
                        name: item.Fsinger_name
                    }))
                }

                const key = item.Findex
                if (!map[key]) {
                    map[key] = {
                        title: key,
                        items: []
                    }
                }

                map[key].items.push(new Singer({
                    id: item.Fsinger_mid,
                    name: item.Fsinger_name
                }))
            })

            // 将数据排序
            let hot = []
            let ret = []

            for (let key in map) {
                let value = map[key]
                if (value.title.match(/[a-zA-Z]/)) {
                    ret.push(value)
                } else if (value.title === HOT_NAME) {
                    hot.push(value)
                }
            }
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret)
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        })
    },
    components: {
        Listview
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .singer
        position: fixed
        width: 100%
        top: 88px
        bottom: 0
</style>
