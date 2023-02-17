import pwRequest from "./index.js"

//获取热门搜索关键字
export function getSearchKeys(){
  return pwRequest.get("/search/hot")
}

//获取搜索建议
export function getSuggest(keywords){
  return pwRequest.get("/search/suggest",{
    keywords,
    type:"mobile"
  })
}
//根据关键字进行搜索
export function searchByKeyword(keywords){
  return pwRequest.get("/cloudsearch",{
    keywords
  })
}