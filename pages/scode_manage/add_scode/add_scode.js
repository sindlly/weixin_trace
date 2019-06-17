// pages/scode_manage/add_scode/add_scode.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scode: {
      name: null,
      description: null,
      attributes_name: null,
      attributes_value: null,
      manufacturer: null,
      barcode: null,
    },
    editscode: {},
    barcode: '',
    imgSrc: "",
    isUpdateImg: false,
    barcode_id: '',
    isEdit: false, //是否是编辑
    scodeEnable: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onChange: function(e) {
    let dataset = e.target.dataset
    this.data[dataset.obj][dataset.item] = e.detail.value
  },
  getScode: function() {
    const _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        _this.setData({
          barcode: res.result
        })
        _this.data.scode.barcode = res.result
      }
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
          title: '请填写所有内容',
          icon: 'none',
          duration: 1000
        })
        break;
      }
    }
    return flag
  },
  uploadImg: function() {
    var _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        _this.setData({
          imgSrc: res.tempFilePaths[0],
          isUpdateImg: true
        })
      }
    })
  },
  commit: function() {
    let _this = this
    let initData = this.data.scode
    if (initData.barcode && initData.barcode.length >= 30) {
      wx.showToast({
        title: '条形码最多30位',
        icon: 'none',
        duration: 1000,
      })
      return
    }

    if (!initData.image) {
      if (!_this.data.isUpdateImg) {
        wx.showToast({
          title: '请上传商品图片',
          icon: 'none',
          duration: 1000,
        })
        return
      }
    }

    if (!_this.validate(initData)) {
      return
    }

    initData.attributes = [{
      name: initData.attributes_name,
      value: initData.attributes_value
    }]
    delete initData.attributes_name
    delete initData.attributes_value
    //先上传图片数据
    if (_this.data.isUpdateImg) {
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
            url: baseUrl + '/barcodes/' + _this.data.barcode_id,
            method: _this.data.isEdit ? "put" : "post",
            data: initData,
            success: function(res) {
              if (res.data.code === 0) {
                wx.showToast({
                  title: _this.data.isEdit ? '条形码修改成功' : '条形码添加成功',
                  icon: 'none',
                  duration: 2000,
                  success: function() {
                    setTimeout(() => {
                      wx.navigateTo({
                        url: '/pages/scode_manage/scode_manage',
                      })
                    }, 1000)
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
        }
      })
    } else {
      //没有图片更新的修改
      wx.request({
        url: baseUrl + '/barcodes/' + _this.data.barcode_id,
        method: "put",
        data: initData,
        success: function(res) {
          if (res.data.code === 0) {
            wx.showToast({
              title: '条形码修改成功',
              icon: 'none',
              duration: 2000,
              success: function() {
                setTimeout(() => {
                  wx.navigateTo({
                    url: '/pages/scode_manage/scode_manage',
                  })
                }, 1000)
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
    }
  },
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        isEdit: true,
        barcode_id: options.id
      })
      wx.request({
        url: baseUrl + '/barcodes/' + options.id,
        success: (res) => {
          const data = res.data.data.data
          this.setData({
            editscode: data,
            imgSrc: baseUrl + '/files/' + data.image,
            barcode: data.barcode,
            scode: {
              barcode: data.barcode,
              description: data.description,
              image: data.image,
              manufacturer: data.manufacturer,
              name: data.manufacturer,
              attributes_name: data.attributes[0].name,
              attributes_value: data.attributes[0].value
            }
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})