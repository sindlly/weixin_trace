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
    key: 'asdf', // 溯源码
    barcodeId: '', // 条形码ID
    products: '', // 条形码产品
    productsColums: [],
    imgSrcMap: [],
    imageIds: []
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

  commit: function() {
    let _this = this
    const tempFilePaths = this.data.imgSrcMap
    this.uploadimg({
      url: baseUrl + '/files',
      path: tempFilePaths,
    }, (key) => {
      wx.request({
        url: baseUrl + '/tracings/' + key,
        success: res => {
          if (res.data.code === 0) {
            const products = res.data.data.products
            const productsColums = products.map((item) => {
              return item.name
            })
            _this.setData({
              products
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
          that.data.imageIds.push(JSON.parse(res.data).data.data[0].id)
          success++;
        },
        fail: () => {
          fail++;
        },
        complete: () => {
          i++;
          if (i == data.path.length) {
            if (callback) callback(that.data.key)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    const key = options.key
    this.setData({
      key
    })
    // 溯源详情
    wx.request({
      url: baseUrl + '/tracings/' + key,
      success: res => {
        if (res.data.code === 0) {
          const products = res.data.data.products
          const productsColums = products.map((item) => {
            return item.name
          })
          _this.setData({
            products
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