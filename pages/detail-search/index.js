// pages/detail-search/index.js
import {
  getSearchKeys,
  getSuggest,
  searchByKeyword
} from '../../service/api_search'
import debounce from '../../utils/debounce'
import {playerStore} from '../../store/index'
import {menuCol} from '../../database/index'
const db = wx.cloud.database()
const debounceGetSuggest = debounce(getSuggest, 300)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeys: [],
    searchVal: "",
    suggests: [],
    songs: [],
    nodes: [],
    _id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options._id){this.setData({_id:options._id})}
    //获取热门关键词搜索
    getSearchKeys().then(res => {
      this.setData({
        hotKeys: res.data.result.hots
      })
    })
  },

  // 处理搜索事件
  handleSearchSuggest(event) {
    //去除空格
    const value = event.detail.trim()
    //空值判断
    if (!value.length) {
      debounceGetSuggest.cancel()
      this.setData({
        suggests: [],
        songs: []
      })
      return
    }
    //获取搜索建议
    this.getSuggestlist(value)
  },

  //获取搜索建议
  getSuggestlist(value) {
    debounceGetSuggest(value).then(res => {
      this.setData({
        suggests: res.data.result.allMatch,
        searchVal:value
      })
      this.keyToNode()
    })
  },

  //点击热门关键点
  handleKeyClick(e) {
    const key = e.currentTarget.dataset.value
    this.setData({
      searchVal: key
    })
    this.handleSearch(key)
  },
  // 搜索事件
  handleSearch(keywords) {
    const that = this
    searchByKeyword(keywords).then(res => {
      const songs = res.data.result.songs
      that.setData({
        songs
      })
    })
  },
  //处理输入框搜索事件
  onSearch() {
    this.handleSearch(this.data.searchVal)
  },
  //匹配字体特殊处理
  keyToNode() {
    const nodes = []
    const searchVal = this.data.searchVal
    const suggests = this.data.suggests
    if (suggests.length > 0) {
      for (const s of suggests) {
        let node = []
        const keyword = s.keyword
        if (keyword.toUpperCase().startsWith(searchVal.toUpperCase())) {
          const key1 = keyword.slice(0, searchVal.length)
          const node1 = {
            name: 'span',
            attrs: {
              style: "color:#4fc08d;font-size:30rpx"
            },
            children: [{
              type: "text",
              text: key1
            }]
          }
          node.push(node1)
          const key2 = keyword.slice(searchVal.length)
          const node2 = {
            name: 'span',
            attrs: {
              style: "font-size:30rpx"
            },
            children: [{
              type: "text",
              text: key2
            }]
          }
          node.push(node2)
        }else {
          const node3 = {
            name: 'span',
            attrs: {
              style: "font-size:30rpx"
            },
            children: [{
              type: "text",
              text: s.keyword
            }]
          }
          node.push(node3)
        }
        nodes.push(node)
      }
    } 
    this.setData({
      nodes
    })
  },
  //处理搜索结果点击
  async handleSongClick(e){
    const _id = this.data._id
    if(_id){
      let res = null
      const item = e.currentTarget.dataset.item
      const cmd = db.command
      res = await menuCol.update(_id,{tracks:cmd.push(item)})
      if(res){
        wx.showToast({
          title: '添加成功~',
        })
      }
      return
    }
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/song-player/index?id=' + id,
    })
    playerStore.setState("playlistSongs",this.data.songs)
    playerStore.setState("playlistIndex",index)
  },
  //处理搜索建议点击
  handleSuggestClick(e){
    const keyword = e.currentTarget.dataset.keyword
    this.setData({searchVal:keyword})
    this.handleSearch(keyword)
  }
})