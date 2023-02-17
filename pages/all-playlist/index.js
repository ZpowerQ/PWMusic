// pages/detail-playlist/index.js
import {getSongMenus} from "../../service/api_music"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playlists:[],
    cat:"全部",
    more:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPlaylistsData(0)
  },
  //请求数据函数
  async getPlaylistsData(offset){
    if(!this.data.more && offset!=0) return
    const res = await getSongMenus(this.data.cat,15,offset)
    var oldData = this.data.playlists
    if(offset === 0){
      this.setData({playlists:res.data.playlists})
    }else{
      this.setData({playlists:oldData.concat(res.data.playlists)})
    }
    this.setData({more:res.data.more})
    wx.stopPullDownRefresh()
  },
  //处理单选框值变化
  onChange(event){
    this.setData({cat:event.detail,playlists:[]})
    this.getPlaylistsData(0)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.getPlaylistsData(this.data.playlists.length)
  },
  onPullDownRefresh:function(){
    this.getPlaylistsData(0)
  }

})