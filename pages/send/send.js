// pages/check/check.js
const app = getApp();
const baseUrl = app.globalData.HOST;
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
    columns: [{text:'杭州',value:"23445"}, '宁波', '温州', '嘉兴', '湖州'],
    goods:[],
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
    console.log(event)
    const { picker, value, index } = event.detail
    let goods_temp = this.data.goods
    goods_temp.push(value)
    console.log(goods_temp);
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
  commit:function(){
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
      success:function(){

      }
    })
  },
  onLoad: function (options) {
    let id = options.id || '762ed648-0877-49b0-a0c0-f6aef0c16552'
    this.data.id = id
    wx.request({
      url: baseUrl +'/tracings/'+id,
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