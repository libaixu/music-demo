<template>
  <transition name="slide">
    <musiclist :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></musiclist>
  </transition>
</template>
<script>
  import Musiclist from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getMusicList } from 'api/rank'
  import { getSongVkey } from 'api/singer'
  import { creatSong } from 'common/js/song'
  import { ERR_OK } from 'api/config'

  export default {
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalize(res.songlist)
          }
        })
      },
      _normalize(list) {
        let ret = []
        list.forEach((item) => {
          if (item.data.songid && item.data.albumid) {
            if (item.data.songmid) {
              getSongVkey(item.data.songmid).then((res) => {
                const vkey = res.data.items[0].vkey
                ret.push(creatSong(item.data, vkey))
              })
            }
          }
        })
        console.log(ret)
        return ret
      }
    },
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length > 1) {
          return this.songs[0].img
        }
        return this.topList.picUrl
      },
      ...mapGetters([
        'topList'
      ])
    },
    components: {
      Musiclist
    }
  }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
