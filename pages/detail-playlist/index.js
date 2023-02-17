// pages/detail-playlist/index.js
import {getDetailPlaylist} from '../../service/api_music'
import {playerStore} from '../../store/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playlist:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id
    getDetailPlaylist(id).then(res=>{
      this.setData({playlist:res.data.playlist})
    })
  },

  handleItemClick(e){
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/song-player/index?id='+id,
    })
    playerStore.setState("playlistSongs",this.data.playlist.tracks)
    playerStore.setState("playlistIndex",index)
  }
})