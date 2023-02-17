import pwRequest from './index'

export function getBanners(){
  return pwRequest.get("/banner",{
    type:1
  })
}
//获取推荐歌曲
export function getRankings(limit){
  return pwRequest.get("/personalized/newsong",{
    limit
  })
}
//获取歌单
export function getSongMenus(cat="全部",limit=6,offset=0){
  return pwRequest.get("/top/playlist",{
    cat,
    limit,
    offset
  })
}
//获取榜单
export function getToplist(){
  return pwRequest.get("/toplist/detail")
}
//获取歌单详情
export function getDetailPlaylist(id){
  return pwRequest.get("/playlist/detail",{
    id
  })
}
//获取歌曲详情
export function getSongDetail(ids){
  return pwRequest.get("/song/detail",{
    ids
  })
}

//获取歌词
export function getLyric(id){
  return pwRequest.get("/lyric",{
    id
  })
}