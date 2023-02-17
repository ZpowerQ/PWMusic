// pages/song-player/index.js
import {audioContext,playerStore} from '../../store/player-store'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    songInfo:{},
    currentPage:0,
    currentTime:0,
    durationTime:0,
    isSlide:false,
    sliderVal:0,
    lyricInfos:[],
    lyric:"歌词",
    lyricIndex:0,
    scrollTop:0,
    isPlay:false,
    playState:"resume",
    modeName:"order",
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id
    this.setData({id})
    //获取歌曲详细信息
    playerStore.dispatch("playSongAction",id)
    this.playerStoreListener()
    
  },
  // 监听store值变化
  playerStoreListener(){

    // 获取歌曲信息
    playerStore.onStates(["songInfo"],({songInfo})=>{
      if(songInfo && songInfo.dt){
        this.setData({songInfo,durationTime:songInfo.dt})
      }
    })
    //监听歌词
    playerStore.onStates(["lyricInfos"],({lyricInfos})=>{
      if(lyricInfos){
        this.setData({lyricInfos})
      }
    })

    //监听播放过程信息
    playerStore.onStates(["currentTime"],({currentTime})=>{
      this.setData({currentTime})
    })
    playerStore.onStates(["sliderVal"],({sliderVal})=>{
      this.setData({sliderVal})
    })
    playerStore.onStates(["lyric"],({lyric})=>{
      this.setData({lyric})
    })
    playerStore.onStates(["lyricIndex"],({lyricIndex})=>{
        this.setData({lyricIndex,scrollTop:45 * lyricIndex})
    })
    playerStore.onStates(["isPlay"],({isPlay})=>{
      this.setData({isPlay})
    })
    playerStore.onStates(["playState"],({playState})=>{
      this.setData({playState})
    })
    playerStore.onStates(["modeName"],({modeName})=>{
      if(modeName) {
        this.setData({modeName})
      }
    })
    
  },
  //处理页面滑动
  handleCurrentChange(e){
    const currentPage = e.detail.current
    this.setData({currentPage})
  },
  //处理slider值改变
  handleSliderChange(e){
    audioContext.pause()
    const value = e.detail.value
    const currentTime = this.data.durationTime * value / 100
    audioContext.seek(currentTime / 1000)
    this.setData({isSlide:false})
    playerStore.setState("sliderVal",value)
  },
  //处理silder滑动
  handleSliderChanging(e){
    const value = e.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({isSlide:true,currentTime})
  },
  //判断歌曲类型
  judgefree(fee){
    switch(fee){
      case 0:
        wx.showToast({
          title: '无法播放可能无版权',
          icon:"none"
        })
      case 1:
        wx.showToast({
          title: 'VIP歌曲无法播放',
          icon:"none"
        })
        break
      case 4:
        wx.showToast({
          title: '需购买专辑',
          icon:"none"
        })
        break
      case 8:
        wx.showToast({
          title: 'VIP可播放高音质',
          icon:"none"
        })
    }
  },
  //处理歌词点击
  handleLyricClick(e){
    const index = e.currentTarget.dataset.index
    const value = this.data.lyricInfos[index].time / this.data.durationTime * 100
    this.handleSliderChange({detail:{value}})
  },
  //处理上一首点击
  handlePreClick(){
    playerStore.dispatch("handlePreAction")
  },
  //处理下一首点击
  handleNextClick(){
    playerStore.dispatch("handleNextAction")
  },
  //暂停播放事件
  handleSongPlay(){
    playerStore.dispatch("handleSongPlayAction")
  },
  //处理播放模式
  handleModeChange(){
    playerStore.dispatch("handleModeChangeAction")
  },
  // 展示播放列表
  showPlaylist(){
    this.data.isShow = true
  }
})
