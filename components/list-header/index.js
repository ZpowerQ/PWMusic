// components/list-header/index.js
import {
  menuCol
} from '../../database/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isCollect: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async handleCollectSong() {
      let res = null
      if (this.data.isCollect) {
        res = await menuCol.remove({id:this.properties.item.id},false)
        this.setData({isCollect: false})
      } else {
        res = await menuCol.add(this.properties.item)
        this.setData({isCollect: true})
      }
      if (res) {
        wx.showToast({
          title: this.data.isCollect?'成功收藏~':'取消收藏~',
        })
      }
    }
  }
})