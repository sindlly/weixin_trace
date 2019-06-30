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
    role_type:userInfo.role_type,
    switch_title:'发货至经销商',
    switch_checked:true,   //true：发送至经销商，false：发送至C端客户
    showPicker:false,
    columns: [{text:'杭州',value:"23445"}, '宁波', '温州', '嘉兴', '湖州'],
    goods:[],
    bind_goods:[],
    bind_tracing:[],
    barcode:'',
    record:{},
    business_id:'',
    business_name:null,
    showDialog:false,
    showDialogToBusiness:false,
    showCommit: false,
    isCourier: userInfo.role_type == "courier"?true:false,
    express:{}
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
    this.data[dataset.obj][dataset.item] = e.detail.value || e.detail
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
  //校验
  validate(data) {
    let flag = true
    //校验有空数据
    for (let i in data) {
      if (!data[i]) {
        flag = false
        wx.showToast({
          title: '请填写完整客户信息',
          icon: 'none',
          duration: 1000
        })
        break;
      }
    }
    return flag
  },
  //重新发货  
  send: function () {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        let result = res.result;
        let patt = new RegExp("https://buildupstep.cn/page/tracing/code?")
        if (patt.test(result)) {
          console.log(result.split("?")[1])
          wx.navigateTo({
            url: '/pages/tracing/tracing?' + result.split("?")[1],
          })
        } else {
          wx.showToast({
            title: '无效的溯源码',
            icon: 'none',
            duration: 1200
          })
          wx.reLaunch({
            url: '/pages/home/home',
          })
        }
      }
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
    let courierData = {
      operation: "express",
      record: _this.data.express
    }
    if (_this.data.switch_checked){
      if (!_this.data.business_id && !_this.data.isCourier){
        wx.showToast({
          title: "请选择经销售",
          icon: 'none',
          duration: 2000,
        })  
      return     
      }
    }
    // 关闭客户信息验证
    // else{
    //   let data =　{
    //     reciver_name: _this.data.record.reciver_name||null,
    //     reciver_phone: _this.data.record.reciver_phone||null,
    //     reciver_address: _this.data.record.reciver_address||null
    //   }
    //   if(!_this.validate(data)){
    //     return
    //   }
    // }
    wx.request({
      url: baseUrl + '/tracings/' + _this.data.id,
      method:'put',
      data: _this.data.isCourier ?courierData:_this.data.switch_checked ? businessData : comsumerData,
      success:function(res){
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: '发送成功',
            // showCancel: false,
            confirmText:'再次发货',
            success(res) {
              if (res.confirm) {
                _this.send()
              } else if (res.cancel) {
                wx.reLaunch({
                  url: '/pages/home/home'
                })
              }
            }
          })
        } else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1200
          })
        }
      }
    })
  },
  onLoad: function (options) {
    let id = options.id ||"01e0c84c8da2773c93eba4dff4e67bd90af2dd7b2764d3843318e19fe59ba0cd4d0b029acc1db463c7fab67d1fd22f2d277b144ff9a5c7d1ec01e9ce75c91e47a9"
    this.data.id = id
    wx.request({
      url: baseUrl +'/tracings/'+id,
      success:res=>{
        
        if (res.data.data.data.products.length == 0 && res.data.data.data.tracing_products.length==0){
          this.setData({
            showDialog:true
          })
        }
        this.setData({
          showCommit: res.data.data.data.owner._id == userInfo.user_id ? true : false,
          bind_goods:res.data.data.data.products,
          bind_tracing: res.data.data.data.tracing_products
        
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
        if (!this.data.isCourier)
        this.openPicker()
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