// pages/regest/regest.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courier: {
      company: null,
      name: null,
      phone: null,
      email: null,
      employee_card: null,     
    },
    imgSrc: null,
  },
  uploadImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        _this.data.courier.employee_card = res.tempFilePaths[0]
        _this.setData({
          imgSrc: res.tempFilePaths[0],
        })
      }
    })
  },
  onChange: function (e) {
    // console.log(e)
    let dataset = e.target.dataset
    this.data[dataset.obj][dataset.item] = e.detail
  },
  commit: function () {
    let _this = this
    //先上传图片数据
    wx.uploadFile({
      url:baseUrl+'/files',
      method: "POST",
      filePath:_this.data.imgSrc,
      name:"files",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(JSON.parse(res.data.data.id))
      }
    })

    // wx.request({
    //   url: baseUrl + '/users', // 仅为示例，并非真实的接口地址
    //   method:"POST",
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   data:{
    //     role_type:'courier',
    //     role_id:50,
    //     courier: _this.data.courier
    //   },
    //   success(res) {
      
    //     console.log("dd")
    //   }
    // })
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