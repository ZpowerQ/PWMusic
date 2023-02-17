// pages/home-music/index.js
import {getBanners,getSongMenus} from '../../service/api_music'
import query_Rect from '../../utils/query-rect' 
import throttle from '../../utils/throttle'
import {rankingStore} from '../../store/index'
import {playerStore} from "../../store/player-store"
const queryRect = throttle(query_Rect,1000,{trailing:true})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],
    swiperH:0,
    recommendSongs:[],
    hotSongMenus:[],
    recommendSongMenus:[],
    toplist:[],
    isPlay:false,
    songInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    getBanners().then(res=>{
      this.setData({banners:res.data.banners})
    })
    //获取推荐music
    rankingStore.dispatch("getRankingDataAction")
    rankingStore.onState("hotRanking",res=>{
      if(!res) return
      const recommendSongs = res.slice(0,10)
      this.setData({recommendSongs})
    })
    //获取热门歌单
    getSongMenus().then(res=>{
      this.setData({hotSongMenus:res.data.playlists})
    })
    //获取推荐歌单
    getSongMenus("华语").then(res=>{
      this.setData({recommendSongMenus:res.data.playlists})
    })
    //获取榜单
    rankingStore.dispatch("getToplistDataAction")
    rankingStore.onState("toplist",res=>{
      if(!res) return
      const toplist = res.slice(0,3)
      this.setData({toplist})
    })
    //监听store
    this.handleStoreListener()
  },

  //处理首页搜索点击
  handleSearchClick(){
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  //获取轮播图的图片高度
  async handleImgLoad(){
    queryRect("#swiperImg").then(res=>{
      this.setData({swiperH:res[0].height})
    })
  },
  //跳转更多推荐歌曲
  handleMoreClick(){
    wx.navigateTo({
      url: `/pages/detail-songs/index?type=recommendSongs`,
    })
  },
  //跳转到更多歌单
  handleMorePlaylist(){
    wx.navigateTo({
      url: '/pages/all-playlist/index',
    })
  },
  // 跳转到更多榜单
  handleToplistMore(){
    wx.navigateTo({
      url: '/pages/all-toplist/index',
    })
  },
  //处理推荐歌曲点击
  handleRsongClick(e){
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/song-player/index?id=' + id,
    })
    playerStore.setState("playlistSongs",this.data.recommendSongs)
    playerStore.setState("playlistIndex",index)
  },
  // 监听store值
  handleStoreListener(){
    playerStore.onState("isPlay",isPlay=>{
      this.setData({isPlay})
    })
    playerStore.onState("songInfo",songInfo=>{
      this.setData({songInfo})
    })
  },
  //处理歌曲播放暂停
  handleSongPlay(){
    if(!this.data.songInfo.id) return
    playerStore.dispatch("handleSongPlayAction")
  },
  // 处理下一首点击
  handleNextClick(){
    if(!this.data.songInfo.id) return
    playerStore.dispatch("handleNextAction")
  },
  //处理播放栏点击
  handleBarClick(){
    const id = this.data.songInfo.id
    if(!id) return
    wx.navigateTo({
      url: '/pages/song-player/index?id=' + id,
    })
  }
})