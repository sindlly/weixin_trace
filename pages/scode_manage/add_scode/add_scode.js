// pages/scode_manage/add_scode/add_scode.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scode:{},
    editscode:{},
    barcode:'',
    imgSrc:"",
    isUpdateImg:false,
    barcode_id:'',
    isEdit:false, //是否是编辑
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onChange: function (e) {
    let dataset = e.target.dataset
    this.data[dataset.obj][dataset.item] = e.detail.value
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
  uploadImg: function () {
    var _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        _this.setData({
          imgSrc: res.tempFilePaths[0],
          isUpdateImg:true
        })
      }
    })
  },
  commit:function(){
    let _this =this
    let initData = this.data.scode
    initData.attributes=[{
      name: initData.attributes_name,
      value: initData.attributes_value
    }]
    delete initData.attributes_name
    delete initData.attributes_value
    //先上传图片数据
    if(_this.data.isUpdateImg){
      wx.uploadFile({
        url: baseUrl + '/files',
        method: "POST",
        filePath: _this.data.imgSrc,
        name: "files",
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          initData.image = JSON.parse(res.data).data.data.id
          wx.request({
            url: baseUrl + '/barcodes',
            method: _this.data.isEdit ? "put" :"post",
            data: initData,
            success: function (res) {
              wx.reLaunch({
                url: '/pages/scode_manage/scode_manage',

              })
            }
          })
        }
      })
    }else{
      //没有图片更新的修改
      wx.request({
        url: baseUrl + '/barcodes/' + _this.data.barcode_id,
        method: "put",
        data: initData,
        success: function (res) {
          wx.reLaunch({
            url: '/pages/scode_manage/scode_manage',

          })
        }
      })
    }
    

    
  },
  onLoad: function (options) {
    if(options.id){
      this.isEdit = true
      this.data.barcode_id = options.id
      wx.request({
        url: baseUrl + '/barcodes/' + options.id,
        success: (res) => {
          let data = res.data.data.data
          this.setData({
            editscode:data,
            imgSrc: baseUrl + '/files/'+data.image,
            barcode: data.barcode
          })
          this.data.scode={
            barcode: data.barcode,
            description: data.description,
            image: data.image,
            manufacturer: data.manufacturer,
            name: data.manufacturer,
            attributes_name: data.attributes[0].name,
            attributes_value: data.attributes[0].value
          }
        }
      })
    }
    
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