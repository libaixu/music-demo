import Storage from 'good-storage'

const SEARCH_KEY = '_search_'
const LENGTH = 15

const PLAYLIST_KEY = '__playList__'
const PLAYLIST_MAX_LENGTH = 100

const FAVORITELIST_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function insertArray(arr, val, compare, maxLen) {
  let index = arr.findIndex(compare)

  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {
  let searches = Storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, LENGTH)

  Storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return Storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
  let searches = Storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  Storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  Storage.set(SEARCH_KEY, [])
  return []
}

export function savePlayListHistory(song) {
  let playList = Storage.get(PLAYLIST_KEY, [])

  insertArray(playList, song, (item) => { return song.id === item.id }, PLAYLIST_MAX_LENGTH)
  Storage.set(PLAYLIST_KEY, playList)
  return playList
}

export function loadPlayListHistory() {
  return Storage.get(PLAYLIST_KEY, [])
}

export function saveFavorite(song) {
  let favoriteList = Storage.get(FAVORITELIST_KEY, [])

  insertArray(favoriteList, song, (item) => { return song.id === item.id }, FAVORITE_MAX_LENGTH)
  Storage.set(FAVORITELIST_KEY, favoriteList)
  return favoriteList
}

export function deleteFavorite(song) {
  let favoriteList = Storage.get(FAVORITELIST_KEY, [])
  deleteFromArray(favoriteList, (item) => {
    return item.id === song.id
  })
  Storage.set(FAVORITELIST_KEY, favoriteList)
  return favoriteList
}

export function loadFavoriteList() {
  return Storage.get(FAVORITELIST_KEY, [])
}