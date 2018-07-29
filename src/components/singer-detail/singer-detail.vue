<template>
  <transition name="slide">
    <!-- <div class="singer-detail"></div> -->
    <musiclist :songs="songs" :title="title" :bg-image="bgImage"></musiclist>
  </transition>
</template>
<script type="text/javascript-6">
  import { mapGetters } from 'vuex'
  import { getSingerDetail, getSongVkey } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import { creatSong } from 'common/js/song'
  import Musiclist from 'components/music-list/music-list'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getDetail()
    },
    methods: {
      // 获取歌单数据
      _getDetail() {
        if (!this.singer.id) {
          this.$router.back()
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalize(res.data.list)
            // console.log(this.songs)
          }
        })
      },
      // 整理数据
      _normalize(data) {
        let ret = []
        data.forEach((item) => {
          let { musicData } = item
          // 为了抓取歌曲获取vkey
          getSongVkey(musicData.songmid).then((res) => {
            const vkey = res.data.items[0].vkey
            if (musicData.songid && musicData.albummid) {
              ret.push(creatSong(musicData, vkey))
            }
          })
        })
        return ret
      }
    },
    components: {
      Musiclist
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'

  // .singer-detail
  //   position: fixed
  //   top: 0
  //   bottom: 0
  //   left: 0
  //   right: 0
  //   z-index: 100
  //   background: $color-background
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
