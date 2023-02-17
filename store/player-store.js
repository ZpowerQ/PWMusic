import {HYEventStore} from 'hy-event-store'
import {getSongDetail,getLyric} from '../service/api_music'
import {parseLyric} from '../utils/parseLyric'
import {recordCol} from '../database/index'
const audioContext = wx.getBackgroundAudioManager()
let timer
const modeNames = ["order","repeat","random"]
const playerStore = new HYEventStore({
  state: {
    id: 0,
    songInfo: {},
    currentTime: 0,
    durationTime: 0,
    lyricInfos:[],
    sliderVal:0,
    lyric:"",
    lyricIndex:0,
    isPlay:false,
    playState:"resume",
    modeIndex:0,
    modeName:"",
    playlistIndex:0,
    playlistSongs:[]
  },
  actions: {
    playSongAction(ctx, id) {
      if(id == ctx.id) return
      // 初始化信息
      ctx.songInfo = {}
      ctx.isPlay = false
      ctx.lyric = ""
      ctx.lyricInfos = []
      ctx.id = id
      //获取音频
      audioContext.stop()
      audioContext.src=`https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
      audioContext.title = id
      audioContext.onCanplay(()=>{
        audioContext.play()
        ctx.isPlay = true
        ctx.playState = "pause"
      })
      audioContext.onPlay(()=>{
        ctx.isPlay = true
      })
      audioContext.onPause(()=>{
        ctx.isPlay = false
      })
      //获取歌曲详细信息
      getSongDetail(id).then(res => {
        ctx.songInfo = res.data.songs[0]
        ctx.durationTime = ctx.songInfo.dt
        this.actions.judgefreeAction(ctx.songInfo.fee)
        audioContext.title = ctx.songInfo.name
        // 将记录添加到数据库
        recordCol.add(ctx.songInfo)

      })
      //获取歌词信息
      getLyric(ctx.id).then(res=>{
        const lyric = res.data.lrc.lyric
        const lyricInfos = parseLyric(lyric,ctx.durationTime)
        ctx.lyricInfos = lyricInfos
      })
      //歌曲播放更新当前时间
      audioContext.onTimeUpdate(()=>{
        const currentTime = audioContext.currentTime * 1000
        const value = currentTime / ctx.durationTime * 100
        ctx.currentTime = currentTime
        ctx.sliderVal = value
        //更新歌词
        const lyricInfos = ctx.lyricInfos
        for(let i = 0;i<lyricInfos.length;i++){
          if(audioContext.currentTime * 1000 < lyricInfos[i].time){
            if(ctx.lyric != lyricInfos[i-1].text){
              ctx.lyric = lyricInfos[i-1].text
              ctx.lyricIndex = i-1
            }
            break
          }
        }
      })
    },
    //判断歌曲类型
    judgefreeAction(fee){
      switch(fee){
        case 0:
          wx.showToast({
            title: '无法播放可能无版权',
            icon:"none"
          })
        case 1:
          wx.showToast({
            title: 'VIP歌曲无法播放，播放下一首',
            icon:"none"
          })
          timer = setTimeout(()=>{
            playerStore.dispatch("handleNextAction")
          },2000)     
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
          break
      }
    },
    //处理歌曲播放结束
    handleEndSongAction(ctx){
      const modeIndex = ctx.modeIndex
      const playlistIndex = ctx.playlistIndex
      switch(modeIndex){
        case 0:
          let index = playlistIndex + 1
          index == ctx.playlistSongs.length?ctx.playlistIndex = 0:ctx.playlistIndex = index
          this.dispatch("playSongAction",ctx.playlistSongs[ctx.playlistIndex].id)
          break
        case 1:
          audioContext.seek(0)
          break
        case 2:
          const playlistSongs2 = ctx.playlistSongs
          let randomIndex = Math.floor(Math.random() * playlistSongs2.length)
          ctx.playlistIndex = randomIndex
          this.dispatch("playSongAction",playlistSongs2[randomIndex].id)
          break
      }
    },
    //处理下一首播放
    handleNextAction(ctx){
      const index = ctx.playlistIndex + 1
      index == ctx.playlistSongs.length?ctx.playlistIndex = 0:ctx.playlistIndex = index
      this.dispatch("playSongAction",ctx.playlistSongs[ctx.playlistIndex].id)
    },
    //处理上一首播放
    handlePreAction(ctx){
      const index = ctx.playlistIndex - 1
      const playlistSongs = ctx.playlistSongs
      index == -1?ctx.playlistIndex = playlistSongs.length - 1:ctx.playlistIndex = index
      this.dispatch("playSongAction",playlistSongs[ctx.playlistIndex].id)
    },
    //处理暂停播放
    handleSongPlayAction(ctx){
      ctx.isPlay ? ctx.isPlay = false : ctx.isPlay = true
      !ctx.isPlay ? ctx.playState = "resume" : ctx.playState = "pause"
      !ctx.isPlay ? audioContext.pause() : audioContext.play()
      if(timer) clearTimeout(timer)
    },
    //改变播放模式
    handleModeChangeAction(ctx){
      ctx.modeIndex++
      if(ctx.modeIndex == 3) ctx.modeIndex = 0
      ctx.modeName = modeNames[ctx.modeIndex]
    }
  }
})
//监听播放结束
audioContext.onEnded(()=>{
  playerStore.dispatch("handleEndSongAction")
})
export {
  playerStore,
  audioContext
}