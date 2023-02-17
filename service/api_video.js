import pwRequest from './index'

//请求mv函数
export function getTopMV(offset, limit = 10) {
  return pwRequest.get("/top/mv", {
    offset,
    limit
  })
}
//根据id获取视频地址
export function getMVurl(id){
  return pwRequest.get("/mv/url",{
    id
  })
}
//根据id获取视频详情
export function getMVDetail(id){
  return pwRequest.get("/mv/detail",{
    mvid:id
  })
}
//根据id获取相关视频
export function getRelatedVideo(id){
  return pwRequest.get("/related/allvideo",{
    id
  })
}
// 根据id获取相似MV
export function getSimiVideo(mvid){
  return pwRequest.get("/simi/mv",{
    mvid
  })
}