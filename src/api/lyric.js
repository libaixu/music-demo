import { commonParams } from 'api/config'
import axios from 'axios'

export function getLyric(mid) {
  let url = '/api/getLyric'

  let data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    format: 'json',
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}