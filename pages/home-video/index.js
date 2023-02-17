// pages/home-video/index.js
import {getTopMV} from "../../service/api_video"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMVs:[],    //mv列表
    hasMore:true  //是否有下一页数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getTopMVData(0)
  },

  //请求数据函数
  async getTopMVData(offset){
    if(!this.data.hasMore && offset!=0) return
    const res = await getTopMV(offset)
    var oldData = this.data.topMVs
    if(offset === 0){
      this.setData({topMVs:res.data.data})
    }else{
      this.setData({topMVs:oldData.concat(res.data.data)})
    }
    this.setData({hasMore:res.data.hasMore})
    wx.stopPullDownRefresh()
  },

  //处理视频点击事件
  handleVideoClick(event){
    //获取视频id
    var id = event.currentTarget.dataset.item.id;
    //跳转到详情页面
    wx.navigateTo({
      url: '/pages/detail-video/index?id=' + id,
    })

  },
  //其他生命周期函数
  onReachBottom:function(){
    this.getTopMVData(this.data.topMVs.length)
  },

  onPullDownRefresh:function(){
    this.getTopMVData(0)
  }
})