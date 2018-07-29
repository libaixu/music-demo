<template>
  <div class="disc">
    <transition name="slide">
      <musiclist :title="title" :bgImage="bgImage" :songs="songs"></musiclist>
    </transition>
  </div>
</template>
<script>
  import Musiclist from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getSonglist } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import { getSongVkey } from 'api/singer'
  import { creatSong } from 'common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSonglist()
    },
    methods: {
      _getSonglist() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSonglist(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalize(res.cdlist[0].songlist)
          }
        })
      },
      _normalize(list) {
        let ret = []
        list.forEach((item) => {
          if (item.songid && item.albumid) {
            if (item.songmid) {
              getSongVkey(item.songmid).then((res) => {
                const vkey = res.data.items[0].vkey
                ret.push(creatSong(item, vkey))
              })
            }
          }
        })
        return ret
      }
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
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
