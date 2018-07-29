import { playMode } from 'common/js/config'
import { loadSearch, loadPlayListHistory, loadFavoriteList } from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playListHistory: loadPlayListHistory(),
  favoriteList: loadFavoriteList()
}

export default state