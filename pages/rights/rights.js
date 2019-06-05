// pages/home/home.js
const app = getApp();
const baseUrl = app.globalData.HOST;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPicker: false,
    steps: [{
        text: '第一步',
        desc: '上传购买订单照片+商品实物照片',
      },
      {
        text: '第二步',
        desc: '描述商品造假鉴定过程',
      }
    ],
    key: '', // 溯源码
    index: '', // 条形码index
    products: '', // 条形码产品
    productsColums: [],
    imgSrcMap: [],
    images: [],
    description: '',
    phone: ''
  },

  onSelect(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    this.setData({
      product: value
    })
  },

  descriptionChange: function(e) {
    this.setData({
      description: e.detail
    })
  },

  phoneChange: function(e) {
    this.setData({
      phone: e.detail
    })
  },

  commit: function() {
    wx.showLoading()
    let _this = this
    const tempFilePaths = this.data.imgSrcMap
    this.uploadimg({
      url: baseUrl + '/files',
      path: tempFilePaths,
    }, (id) => {
      const {
        images,
        description,
        phone,
        index,
        products
      } = this.data
      const params = {
        barcode: products[index]._id,
        images,
        description,
        phone,
        key: id
      }
      wx.request({
        url: baseUrl + '/counterfeits',
        method: "post",
        data: params,
        header: {
          'content-type': 'application/json',
        },
        success: res => {
          wx.hideLoading()
          if (res.data.code === 0) {
            wx.showToast({
              title: '提交成功',
              icon: 'none',
              duration: 2000,
              success: function() {
                setTimeout(()=> {
                  wx.navigateTo({
                    url: '/pages/home/home',
                  })
                }, 1000)
              }
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    })
  },

  uploadimg: function(data, callback) {
    var arr = [];
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    if (data.path.length == 0) {
      wx.showToast({
        title: '请上传您的截图',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.uploadFile({
        url: data.url,
        filePath: data.path[i].src,
        name: 'files',
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          that.data.images.push(JSON.parse(res.data).data.data.id)
          success++;
        },
        fail: () => {
          fail++;
        },
        complete: () => {
          i++;
          if (i == data.path.length) {
            if (callback) callback(that.data.id)
          } else {
            data.i = i;
            data.success = success;
            data.fail = fail;
            that.uploadimg(data, callback);
          }
        }
      })
    }
  },

  selectImg: function(event) {
    var _this = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        let arr = _this.data.imgSrcMap
        if (event.target.dataset.index || event.target.dataset.index == 0) {
          arr[event.currentTarget.dataset.index].src = res.tempFilePaths[0]
        } else {
          arr.push({
            src: res.tempFilePaths[0]
          })
        }
        _this.setData({
          imgSrcMap: arr
        })
      }
    })
  },

  pickerChange: function(e) {
    const index = e.detail.value
    this.setData({
      index,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    const id = options.id || '5cf6130f65779e2cafbc2a23';
    const key = options.key || '01ff3972349cc4ddd49e47dc36af04d2048c7b712d74eafb975225d36d235d6b85dea3810744a80e5b454c07d1b232bda844f540b9eaec933ee8459b82a3ad6ef8'
    this.setData({
      key,
      id,
    })
    // 溯源详情
    wx.request({
      url: baseUrl + '/tracings/' + key,
      success: res => {
        if (res.data.code === 0) {
          const {
            products
          } = res.data.data.data
          const productsColums = products.map((item) => {
            return item.name
          })
          _this.setData({
            products,
            productsColums
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
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