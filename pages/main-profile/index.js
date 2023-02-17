// pages/main-profile/index.js
import {menuCol} from '../../database/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isload:false,
    userInfo:{},
    tabs:[
      {name:"我的收藏",type:"collect"},
      {name:"我的喜欢",type:"like"},
      {name:"历史记录",type:"record"}
    ],
    menulist:[],
    show:false,
    value:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    //获取本地存储的登录信息
    const userInfo = wx.getStorageSync('userInfo')
    const openid = wx.getStorageSync('openid')
    this.setData({isload:!!openid})
    if(this.data.isload){
      this.setData({userInfo})
    }
  },
  onShow(){
    this.handleGetMenulist()
  },
  async onLogin(){
    // 获取用户头像和昵称
    const profile = await wx.getUserProfile({
      desc: '获取用户头像和昵称',
    })
    const userInfo = profile.userInfo
    
    //获取用户openId
    const res = await wx.cloud.callFunction({
      name:"music-login"
    })
    const openid = res.result.openid
    //本地存储
    wx.setStorageSync('userInfo', userInfo)
    wx.setStorageSync('openid', openid)

    this.setData({userInfo,isload:true})
  },
  // 监听收藏/喜欢/历史记录的点击
  onTabItemClick(e){
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/profile-songs/index?name=${item.name}&type=${item.type}`,
    })
  },
  // 获取所有歌单
  async handleGetMenulist(){
    const res = await menuCol.query({_openid:wx.getStorageSync('openid')})
    if(res){this.setData({menulist:res.data})}
  },
  async handleDeleteMenu(e){
    const id = e.currentTarget.dataset.id
    const _this = this
    wx.showModal({
      content: '是否删除',
      success (res) {
        if (res.confirm) {
          _this.deleteDbMenu(id)
        }
      }
    })
  },
  // 从数据库删除歌单
  async deleteDbMenu(id){
    const res = await menuCol.remove({id},false)
    if(res){
      wx.showToast({
        title: '删除成功~',
      })
      this.handleGetMenulist()
    }
  },
  // 显示添加对话框
  showDialog(){
    this.setData({show:true})
  },
  //更新输入框的值
  onChange(e){
    this.setData({value:e.detail})
  },
  // 添加歌单
  async onConfirm(){
    console.log('aaa');
    const res = await menuCol.add({
      name:this.data.value,
      tracks:[]
    })
    if(res){
      wx.showToast({
        title: '添加成功~',
      })
      this.handleGetMenulist()
    }
  },
  // 处理菜单点击
  handleMenuClick(e){
    const id = e.currentTarget.dataset.id
    const _id = e.currentTarget.dataset._id
    wx.navigateTo({
      url: `/pages/detail-profilemenu/index?_id=${_id}&id=${id}`,
    })
  }

})