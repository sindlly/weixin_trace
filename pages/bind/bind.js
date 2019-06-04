// pages/check/check.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    baseUrl: baseUrl,
    switch_title:'发货至经销商',
    switch_checked:true,
    showPicker:false,
    columns: [],
    goods:[],
    isBind:false,
    bind_goods:[],
    showCommit:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  switchOnChange:function(e){
    this.setData({
      switch_title: e.detail ? '发货至经销商' :'发货给消费者',
      switch_checked: e.detail
    })
  },
  openPicker:function(){
    this.setData({
      showPicker:true
    })
  },
  picked: function (event){
    const { picker, value, index } = event.detail
    let goods_temp = this.data.goods
    goods_temp.push(value)
    this.setData({
      showPicker:false,
      goods:goods_temp
      
    })
  },
  onCancel:function(){
    this.setData({
      showPicker: false,
    })
  },
  deleteGoods:function(e){
    let index = e.target.dataset.index
    let goods_temp = this.data.goods
    goods_temp.splice(index,1)
    this.setData({
      goods:goods_temp
    })
  },
  gohome:function(){
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
  commit:function(){
    // wx.showToast({
    //   title: '成功',
    //   icon: 'success',
    //   duration: 2000
    // })
    let _this = this
    let goods = this.data.goods
    let products = []
    for (let i=0;i<goods.length;i++){
      products[i] = goods[i].value
    }
    let commitData = {
      operation:'bind',
      products:products,
    }
    wx.request({
      url: baseUrl + '/tracings/' + _this.data.id,
      method:'put',
      data:commitData,
      success:function(res){
        if (res.data.code == 0) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              wx.reLaunch({
                url: '/pages/home/home',
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
        }
        
      }
    })
  },
  onLoad: function (options) {
    let id = options.id || '01ff3972349cc4ddd49e47dc36af04d2048c7b712d74eafb975225d36d235d6b85dea3810744a80e5b454c07d1b232bda844f540b9eaec933ee8459b82a3ad6ef8'
    this.setData({
      id : id
    })
    wx.request({
      url: baseUrl +'/tracings/'+id,
      success:res=>{
          this.setData({
            isBind: res.data.data.data.state =="UNBIND"?false:true,
            bind_goods:res.data.data.data.products,
            showCommit:res.data.data.data.owner._id==userInfo.user_id?true:false
          })
      }
    })
    wx.request({
      url: baseUrl +'/barcodes',
      success:res =>{
        let temp = res.data.data.data
        let goods_temp = []
        for(let i=0;i<temp.length;i++){
          goods_temp[i] = {
            text:temp[i].name,
            value:temp[i]._id,
          }
        }
        this.setData({
          columns: goods_temp
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})