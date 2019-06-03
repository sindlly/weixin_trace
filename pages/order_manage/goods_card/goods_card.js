// pages/order_manage/goods_card/goods_card.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo')
Component({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    role_type: userInfo.role_type,
    showDialog:true
  },
  properties :{
    perentData:{
      type: Array,
      value:[]
    }
  },
  methods:{
    todetail: function (data) {
      let id = data.currentTarget.dataset.id
      
      wx.navigateTo({
        url: '/pages/order_manage/goods_detail/goods_detail?id='+id,
      })
    },
    pay: function (data){
      let id = data.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/pay/pay?id=' + id,
      })
    },
    // 设置抽佣
    setPrice:function(data){
      let id = data.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/setPrice/setPrice?id=' + id,
      })
    },
    //销售人员
    salesmanDetail:function(data){
      let salesman = data.currentTarget.dataset.salesman
      wx.navigateTo({
        url: '/pages/salesman/salesman?salesman=' + JSON.stringify(salesman),
      })
    },
    //审核厂家
    ensureFactory: function (data){
      let factory = data.currentTarget.dataset.factory
      wx.navigateTo({
        url: '/pages/ensureFactory/ensureFactory?factory=' + JSON.stringify(factory),
      })
    },
    //确认付款
    ensureMoney: function(data) {
      let id = data.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/ensureMoney/ensureMoney?id=' + id,
      })
    },
    //提交快递
    submitCourier: function (data) {
      let id = data.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/courier/courier?id=' + id,
      })
    },
    //查看快递
    lookLogistics:function(e){
      let express = e.currentTarget.dataset.express
      wx.navigateTo({
        url: '/pages/logistic/logistic?id=' + express.id + "&name=" + express.name,
      })
    },
    //确认收货
    conform:function(e){
      let id = e.currentTarget.dataset.id
      wx.showModal({
        title: '确认收货',
        content: '请确定您已收到货物',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: baseUrl + '/orders/' + id,
              method:'put',
              data:{
                status:'FINISHED'
              },
              success:function(){
                wx.navigateTo({
                  url: '/pages/order_manage/order_manage',
                })
              }

            })
          } else if (res.cancel) {
            
          }
        }
      })
    }
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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