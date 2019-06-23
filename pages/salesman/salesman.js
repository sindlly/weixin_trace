// pages/salesman/salesman.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    name: '',
    phone: '',
    address: '',
    id_card:'',
    totalPrice:'',
    totalCommission:'',
    factoryCount:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let salesman=JSON.parse(options.salesman)
    console.log()
    wx.request({
      url: baseUrl + '/users/' + salesman._id +'/statistics?type=salesman',
      success:res=>{
        let data = res.data.data.data.data
        this.setData({
          name: salesman.salesman.name,
          phone: salesman.salesman.phone,
          address: salesman.salesman.address,
          id_card: salesman.salesman.id_card,
          totalPrice: data.totalPrice || 0,
          totalCommission: data.totalCommission || 0,
          factoryCount: data.factoryCount || 0
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