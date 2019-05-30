// pages/order_manage/goods_detail/goods_detail.js
const util = require('../../../utils/util.js')
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    role_type:wx.getStorageSync('userInfo').role_type,
    goods:{},
    salesman:{},
    active:-1,
    steps: [
    ]
  },
  ensureMoney: function (data) {
    let id = data.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/ensureMoney/ensureMoney?id=' + id,
    })
  },
  pay: function (data) {
    let id = data.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pay/pay?id=' + id,
    })
  },
  //提交快递
  submitCourier: function (data) {
    let id = data.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/courier/courier?id=' + id,
    })
  },
  //查看快递
  lookLogistics: function (e) {
    let express = e.currentTarget.dataset.express
    wx.navigateTo({
      url: '/pages/logistic/logistic?id=' + express.id + "&name=" + express.name,
    })
  },
  conform: function (e) {
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认收货',
      content: '请确定您已收到货物',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: baseUrl + '/orders/' + id,
            method: 'put',
            data: {
              status: 'FINISHED'
            },
            success: function () {
              wx.redirectTo({
                url: '/pages/order_manage/order_manage',
              })
            }

          })
        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let _this = this
    wx.request({
      url: baseUrl + '/orders/' + id,
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
                desc: util.convertUTCTimeToLocalTime(data.created_at)
              }, {
                text: '待报价',
                desc: "定制的商品尺寸不同，需要时间评估费用"
              },]
            active = 2
              break;
          case "QUOTED":   //待付款。对于普通商品，没有报价过程。通过isStagePay来区分
            if (!data.isStagePay){
              //普通商品
              steps = [
                {
                  text: '订单编号',
                  desc: data.no
                }, {
                  text: '创建时间',
                  desc: util.convertUTCTimeToLocalTime(data.created_at)
                }, {
                  text: '待付款',
                  desc: "点击支付款项，上传付款账户和截图后，完成付款步骤"
                },]  
            }else{
              steps = [
                {
                  text: '订单编号',
                  desc: data.no
                }, {
                  text: '创建时间',
                  desc: util.convertUTCTimeToLocalTime(data.created_at)
                }, {
                  text: '报价时间',
                  desc: util.convertUTCTimeToLocalTime(data.quote_at)
                }, {
                  text: _this.data.role_type=='platform'?'待收款':'待付款',
                  desc: _this.data.role_type == 'platform' ? "买家在‘付款明细’页，上传付款账户和截图后，完成付款步骤" :'点击支付款项，上传付款账户和截图后，完成付款步骤'
                },]  
            }
            
            active = 3
              break;
          case "FIRST_PAYED":  //支付了首付款，1、等待确认；2、已确认
            steps = [
              {
                text: '订单编号',
                desc: data.no
              }, {
                text: '创建时间',
                desc: util.convertUTCTimeToLocalTime(data.created_at)
              }, {
                text: '报价时间',
                desc: util.convertUTCTimeToLocalTime(data.quote_at)
              }, {
                text: '首付时间',
                desc: util.convertUTCTimeToLocalTime(data.trade[0].pay_at)
              }, {
                text: '待确认',
                desc: "待确认：等待平台核收款项"
              }]
            active = 4
            break;
          case "ALL_PAYED":  //待核收
            steps = [
              {
                text: '订单编号',
                desc: data.no
              }, {
                text: '创建时间',
                desc: util.convertUTCTimeToLocalTime(data.created_at)
              }, 
              {
                text: '付款时间',
                desc: util.convertUTCTimeToLocalTime(data.trade[0].pay_at)
              },  
              {
                text: '待核收',
                desc: "待核收：等待核收款项后发货"
              },]
            active = 5
            break;
          case "PAYMENT_CONFIRMED":  //已核收，待发货（平台状态）
            steps = [
              {
                text: '订单编号',
                desc: data.no
              }, {
                text: '创建时间',
                desc: util.convertUTCTimeToLocalTime(data.created_at)
              },
              {
                text: '付款时间',
                desc: util.convertUTCTimeToLocalTime(data.trade[0].pay_at)
              },
              {
                text: data.allPaymentConfirm_at?'核收时间':'首付核收时间',
                desc: data.allPaymentConfirm_at ? util.convertUTCTimeToLocalTime(data.allPaymentConfirm_at) : util.convertUTCTimeToLocalTime(data.firstPaymentConfirm_at)
              },
              {
                text: '待发货',
                desc: data.role_type=='platform'?"待发货：提交快递，发货至客户":"等待平台发送快递"
              },]
            active = 5
            break;    
          case "SHIPPED":  //已发货等待确定
            if (!data.isStagePay){
              steps = [
                {
                  text: '订单编号',
                  desc: data.no
                }, {
                  text: '创建时间',
                  desc: util.convertUTCTimeToLocalTime(data.created_at)
                },
                {
                  text: '付款时间',
                  desc: util.convertUTCTimeToLocalTime(data.allPaymentConfirm_at)
                },
                {
                  text: '发货时间',
                  desc: util.convertUTCTimeToLocalTime(data.express.send_at)
                },
                {
                  text: '待收货',
                  desc: "待收货：确认后完成交易"
                },]
            }else{
              steps = [
                {
                  text: '订单编号',
                  desc: data.no
                }, {
                  text: '创建时间',
                  desc: util.convertUTCTimeToLocalTime(data.created_at)
                }, {
                  text: '报价时间',
                  desc: util.convertUTCTimeToLocalTime(data.quote_at)
                }, {
                  text: '首付时间',
                  desc: util.convertUTCTimeToLocalTime(data.trade[0].pay_at)
                }, {
                  text: '首付确认时间',
                  desc: util.convertUTCTimeToLocalTime(data.firstPaymentConfirm_at)
                },
                {
                  text: '发货时间',
                  desc: util.convertUTCTimeToLocalTime(data.express.send_at)
                },
                {
                  text: '确认收货',
                  desc:'点击确认收货完成订单'
                }]
            }
            
            active = 5
            break;
          case "FINISHED":  //已发货等待确定
            if (!data.isStagePay){
              steps = [
                {
                  text: '订单编号',
                  desc: data.no
                }, {
                  text: '创建时间',
                  desc: util.convertUTCTimeToLocalTime(data.created_at)
                },
                {
                  text: '付款时间',
                  desc: util.convertUTCTimeToLocalTime(data.allPaymentConfirm_at)
                },
                {
                  text: '发货时间',
                  desc: util.convertUTCTimeToLocalTime(data.express.send_at)
                },
                {
                  text: '确认时间',
                  desc: util.convertUTCTimeToLocalTime(data.finish_at)
                },]
            }else{
              steps = [
                {
                  text: '订单编号',
                  desc: data.no
                }, {
                  text: '创建时间',
                  desc: util.convertUTCTimeToLocalTime(data.created_at)
                }, {
                  text: '报价时间',
                  desc: util.convertUTCTimeToLocalTime(data.quote_at)
                }, {
                  text: '首付时间',
                  desc: util.convertUTCTimeToLocalTime(data.trade[0].pay_at)
                }, {
                  text: '首付确认时间',
                  desc: util.convertUTCTimeToLocalTime(data.firstPaymentConfirm_at)
                },
                {
                  text: '发货时间',
                  desc: util.convertUTCTimeToLocalTime(data.express.send_at)
                },
                {
                  text: '确认收货时间',
                  desc: util.convertUTCTimeToLocalTime(data.finish_at)
                }]
            }
            
            active = 6
            break;
        }
        _this.setData({
          goods: data,
          steps: steps,
          active: active,
          // salesman: data.salesman.salesman||null
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