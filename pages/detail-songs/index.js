// pages/detail-songs/index.js
import {rankingStore,playerStore} from '../../store/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.type === "recommendSongs"){
      rankingStore.onState("hotRanking",res=>{
        this.setData({songlist:res})
      })
    }
  },
  handleItemClick(e){
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/song-player/index?id='+id,
    })
    playerStore.setState("playlistSongs",this.data.songlist)
    playerStore.setState("playlistIndex",index)
  }
  
})