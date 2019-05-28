// pages/regest/regest.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    factory:{
       name:null,
       public_account:null,
       email:null,
       contact:null,
       phone:null,
       license:null,
       receiving_info:{
        name:null,
        phone:null,
        address:null
       },
      },
    imgSrc:null
  },
  uploadImg: function () {
    var _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        _this.data.factory.license = res.tempFilePaths[0]
        _this.setData({
          imgSrc : res.tempFilePaths[0]
        })
      }
    })
  },
  onChange:function(e){
    // console.log(e)
    let dataset = e.target.dataset
    this.data[dataset.obj][dataset.item] = e.detail
  },
  onChange2:function(e){
    let temp = e.target.dataset.obj
    let dataset = temp.split(".")
    this.data[dataset[0]][dataset[1]][dataset[2]] = e.detail
  },
  commit:function(){
    let _this = this
    if (_this.validate(this.data.factory)) {
      //先上传图片数据
      wx.uploadFile({
        url: baseUrl + '/files',
        method: "POST",
        filePath: _this.data.imgSrc,
        name: "files",
        header: {
          'content-type': 'application/json'
        },
        success(res) {

          _this.data.factory.license = JSON.parse(res.data).data.data.id
          wx.request({
            url: baseUrl + '/users',
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              role_type: 'factory',
              role_id: 20,
              factory: _this.data.factory
            },
            success(res) {
              console.log("he")
              if (res.data.code == 0) {
                wx.showModal({
                  title: '恭喜您',
                  content: '注册成功，等待管理员审核',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '/pages/home/home'
                      })
                    }
                  }
                })
              }
              else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        }
      })
    }
  },
  //校验
  validate(data) {
    let flag = true
    //校验有空数据
    for (let i in data) {
      console.log(data[i])
      if (!data[i]) {
        flag = false
        wx.showToast({
          title: '请填写所有内容',
          icon: 'none',
          duration: 1000
        })
        break;
      }
    }
    return flag
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