// pages/detail-profilemenu/index.js
import {menuCol} from '../../database/index'
import {playerStore} from '../../store/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songinfo:{},
    id:"",
    _id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const _id = options._id
    this.setData({id:options.id,_id})
  },
  async onShow(){
    const res = await menuCol.query(this.data._id,true)
    this.setData({songinfo:res.data})
  },
  handleAddSongs(){
    wx.navigateTo({
      url: '/pages/detail-search/index?_id=' + this.data._id,
    })
  },
  handleItemClick(e){
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/song-player/index?id='+id,
    })
    playerStore.setState("playlistSongs",this.data.songinfo.tracks)
    playerStore.setState("playlistIndex",index)
  }
})