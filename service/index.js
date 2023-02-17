const BASE_URL = "http://www.qingjing.link:3000"
class PWRequest {
  request(url, method, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + url,
        method: method,
        data: params,
        success: function (res) {
          resolve(res)
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  }
  get(url,params){
    return this.request(url,"GET",params)
  }
  post(url,data){
    return this.request(url,"POST",data)
  }
}
const pwRequest = new PWRequest()
export default pwRequest