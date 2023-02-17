import {HYEventStore} from 'hy-event-store'

import {getRankings,getToplist} from '../service/api_music'

const rankingStore = new HYEventStore({
  state:{
    hotRanking:[],
    toplist:[]
  },
  actions:{
    //获取推荐歌曲
    getRankingDataAction(ctx){
      getRankings(50).then(res=>{
        ctx.hotRanking = res.data.result;
      })
    },
    //获取榜单
    getToplistDataAction(ctx){
      getToplist().then(res=>{
        ctx.toplist = res.data.list
      })
    }
  }
})

export {
  rankingStore
}