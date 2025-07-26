/**
 * @name 网易云+酷我
 * @description 支持酷我和网易云两大平台
 * @version 1.0.0
 * @author Sereinf
 */

const { EVENT_NAMES, request, utils, on, send } = globalThis.lx

const qualitys = {
  kw: { '128k': '128kmp3', '320k': '320kmp3', 'flac': '2000kflac', 'flac24bit': '4000kflac' },
  wy: { '128k': 'standard', '320k': 'exhigh', 'flac': 'lossless', 'flac24bit': 'hires' }
}

const httpRequest = (url, option) => new Promise((resolve, reject) => {
  request(url, option, (err, res) => {
    if (err) return reject(err)
    resolve(res.body)
  })
})

const apis = {
  kw: {
    musicUrl({ songmid }, quality) {
      const url = `https://mobi.kuwo.cn/mobi.s?f=web&source=jiakong&type=convert_url_with_sign&br=${quality}&rid=${songmid}`
      return httpRequest(url, { method: 'GET' }).then(data => data.data.url)
    }
  },
  wy: {
    async musicUrl({ songmid }, quality) {
      let url = 'https://api.toubiec.cn/api/get-token.php'
      const { token } = await httpRequest(url, { method: 'POST' })
      url = 'https://api.toubiec.cn/api/music_v1.php'
      return httpRequest(url, {
        method: 'POST',
        headers: { 'authorization': `Bearer ${token}` },
        body: JSON.stringify({
          level: quality,
          token: utils.crypto.md5(token),
          type: 'song',
          url: `https://music.163.com/song?id=${songmid}`
        })
      }).then(data => data.url_info.url)
    }
  }
}

on(EVENT_NAMES.request, ({ source, info }) => {
  return apis[source].musicUrl(info.musicInfo, qualitys[source][info.type]).catch(err => {
    return Promise.reject(err)
  })
})

send(EVENT_NAMES.inited, {
  openDevTools: false,
  sources: {
    kw: { name: '酷我音乐', type: 'music', actions: ['musicUrl'], qualitys: ['128k', '320k', 'flac', 'flac24bit'] },
    wy: { name: '网易云音乐', type: 'music', actions: ['musicUrl'], qualitys: ['128k', '320k', 'flac', 'flac24bit'] }
  }
})