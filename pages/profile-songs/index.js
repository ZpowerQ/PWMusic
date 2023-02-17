// pages/profile-songs/index.js
const db = wx.cloud.database()
import {recordCol} from '../../database/index'
import {playerStore} from '../../store/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    type:"",
    itemlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({title:options.name,type:options.type})
    this.handleQueryData()
  },

  async handleQueryData(){
    const col = db.collection(`m_${this.data.type}`)
    const res = await col.where({_openid:wx.getStorageSync('openid')}).get()
    this.setData({itemlist:res.data})
  },
  // 清空记录
  async handleClearAll(){
    wx.showModal({
      content: '是否清空',
      complete:async (r) => {
        if (r.confirm) {
          let res = null
          res = await recordCol.remove({_openid:wx.getStorageSync('openid')},false)
          if(res){
            wx.showToast({
              title: '成功清空~',
            })
            this.handleQueryData()
          }
        }
      }
    })
  },
  //处理歌曲点击事件
  handleItemClick(e){
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/song-player/index?id='+id,
    })
    playerStore.setState("playlistSongs",this.data.itemlist)
    playerStore.setState("playlistIndex",index)
  }
})