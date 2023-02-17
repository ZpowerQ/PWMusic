// pages/detail-toplist/index.js
import {rankingStore} from "../../store/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toplists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    rankingStore.onState("toplist",res=>{
      this.setData({toplists:res})
    })
  },

})