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
    switch_checked:true,   //true：发送至经销商，false：发送至C端客户
    showPicker:false,
    columns: [{text:'杭州',value:"23445"}, '宁波', '温州', '嘉兴', '湖州'],
    goods:[],
    bind_goods:[],
    barcode:'',
    record:{},
    business_id:'',
    business_name:null,
    showDialog:false,
    showDialogToBusiness:false,
    showCommit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  switchOnChange:function(e){
    this.setData({
      switch_title: e.detail ? '发货至经销商' :'发货给消费者',
      switch_checked: e.detail,
      business_name:null
    })
  },
  //没有经销商就先邀请
  goInvatBusiness:function(){
    wx.navigateTo({
      url: '/pages/invatBussiness/invatBussiness?invat_name=' + wx.getStorageSync("userInfo").nickName + '&invat_id=' + wx.getStorageSync("userInfo").user_id,
    })
  },
  onChange: function (e) {
    let dataset = e.target.dataset
    this.data[dataset.obj][dataset.item] = e.detail.value
  },
  openPicker:function(){
    if (this.data.columns.length == 0) {
      this.setData({
        showDialogToBusiness: true
      })
    }else{
      this.setData({
        showPicker: true
      })
    }
    
  },
  picked: function (event){
    const { picker, value, index } = event.detail
    let goods_temp = this.data.goods
    goods_temp.push(value)
    this.setData({
      showPicker:false,
      goods:goods_temp,
      business_id: event.detail.value.value,
      business_name: event.detail.value.text
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
  getScode: function () {
    const _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        _this.setData({
          barcode: res.result
        })
      }
    })
  },
  goHome: function () {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
  commit:function(){
    let _this = this
    _this.data.record.reciver_type="consumer"
    let comsumerData ={
      operation:"send",
      record: _this.data.record
    }
    let businessData ={
      operation: "send",
      record: {
        reciver_type: 'business',
        reciver: _this.data.business_id, //经销商ID
      }
    }
    if (_this.data.switch_checked){
      if (!_this.data.business_id){
        wx.showToast({
          title: "请选择经销售",
          icon: 'none',
          duration: 2000,
        })  
      return     
      }
    }
    wx.request({
      url: baseUrl + '/tracings/' + _this.data.id,
      method:'put',
      data: _this.data.switch_checked ? businessData : comsumerData,
      success:function(){
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: '绑定成功',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/home/home'
                })
              }
            }
          })
        } 
      }
    })
  },
  onLoad: function (options) {
    let id = options.id ||"01ff3972349cc4ddd49e47dc36af04d2048c7b712d74eafb975225d36d235d6b85dea3810744a80e5b454c07d1b232bda844f540b9eaec933ee8459b82a3ad6ef8"
    this.data.id = id
    wx.request({
      url: baseUrl +'/tracings/'+id,
      success:res=>{
        
        if (res.data.data.data.products.length == 0){
          this.setData({
            showDialog:true
          })
        }
        this.setData({
          showCommit: res.data.data.data.owner._id == userInfo.user_id ? true : false,
          bind_goods:res.data.data.data.products
        })
      }
    })
    wx.request({
      url: baseUrl +'/users/'+wx.getStorageSync('userInfo').user_id+"/businesses",
      success:res =>{
        let temp = res.data.data.data
        
        let goods_temp = []
        for(let i=0;i<temp.length;i++){
          goods_temp[i] = {
            text: temp[i].business.name,
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