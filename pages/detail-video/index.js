// pages/detail-video/index.js
import {getMVurl,getMVDetail,getRelatedVideo,getSimiVideo} from '../../service/api_video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo:{},
    mvDetail:{},
    relatedVideos:[],
    simiVideos:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id
    console.log(id)
    this.getPageData(id)
  },

  getPageData(id){
    getMVurl(id).then(res=>{
      this.setData({mvURLInfo:res.data.data})
    })

    getMVDetail(id).then(res=>{
      this.setData({mvDetail:res.data.data})
    })

    getRelatedVideo(id).then(res=>{
      this.setData({relatedVideos:res.data.data})
    })

    getSimiVideo(id).then(res=>{
      const simiVideos = res.data.mvs
      this.setData({simiVideos})
    })
  },
  handleItemClick(e){
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail-video/index?id=' + id,
    })
  }
})