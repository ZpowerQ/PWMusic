// components/song-detail/index.js
import {favorCol,likeCol,recordCol} from '../../database/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:{}
    },
    index:{
      type:Number,
      value:0
    },
    showMore:{
      type:Boolean,
      value:false
    },
    showDelete:{
      type:Boolean,
      value:false
    },
    type:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    async handleMoreClick(){
      wx.showActionSheet({
        itemList: ["收藏","喜欢"],
        success:(res)=>{
          this.handleOptionResult(res.tapIndex)
        }
      })
    },
    async handleOptionResult(index){
      let res = null
      switch(index){
        case 0:
          res = await favorCol.add(this.properties.item)
          break
        case 1:
          res = await likeCol.add(this.properties.item)
          break
      }
      if(res){
        const title = index == 0 ?"收藏":"喜欢"
        wx.showToast({
          title: `${title}成功~`,
        })
      }
    },
    async handleDeleteClick(){
      const _this = this
      wx.showModal({
        content: '是否删除该条歌曲',
        success (res) {
          if (res.confirm) {
            _this.checkTypeRemove(_this.properties.type)
          }
        }
      })
    },
    async checkTypeRemove(type){
      let res = null
      switch(type){
        case '我的收藏':
          res = await favorCol.remove({id:this.properties.item.id},false)
          break
        case '我的喜欢':
          res = await likeCol.remove({id:this.properties.item.id},false)
          break
        case '历史记录':
          res = await recordCol.remove({id:this.properties.item.id},false)
          break
      }
      if(res){
        wx.showToast({
          title: '删除成功',
        })
        this.triggerEvent('reflesh')
      }
    }
  }
})
