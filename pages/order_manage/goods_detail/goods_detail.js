// pages/order_manage/goods_detail/goods_detail.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    goods:{},
    active:-1,
    steps: [
      {
        text: '订单编号',
        desc: '描述信息'
      },
      {
        text: '创建时间',
        desc: '描述信息'
      },
      {
        text: '报价时间',
        desc: '描述信息'
      },
      {
        text: '步骤四',
        desc: '描述信息'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let _this = this
    wx.request({
      url: baseUrl +'/orders/'+id,
      success:function(res){
        let data = res.data.data.data
        let steps = []
        let active = -1
        //待报价
        switch(data.status){
          case "CREATED":
            steps= [
              {
                text: '订单编号',
                desc: data.no
              }, {
                text: '创建时间',
                desc: data.created_at
              }, {
                text: '待报价',
                desc: "定制的商品尺寸不同，需要时间评估费用"
              },]
            active = 2
              break;
          case "QUOTED":
            steps= [
              {
                text: '订单编号',
                desc: data.no
              }, {
                text: '创建时间',
                desc: data.created_at
              }, {
                text: '报价时间',
                desc: data.updated_at
              }, {
                text: '待收款',
                desc: "买家在‘付款明细’页，上传付款账户和截图后，完成付款步骤"
              },]  
            active = 3
              break;

        }
        _this.setData({
          goods: data,
          steps: steps,
          active: active
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