const WorkBiz = require('../../../../biz/work_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		curDetail: 'detail'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		if (!WorkBiz.isWork(this, false)) return;
		if (!pageHelper.getOptions(this, options)) return;
		wx.s


		WorkBiz.loadDetail(this);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	async onPullDownRefresh() {
		await WorkBiz.loadDetail(this);
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	},

	bindDetailTap: function (e) {
		let curDetail = pageHelper.dataset(e, 'detail');
		this.setData({
			curDetail
		});
	},

	url(e) {
		pageHelper.url(e, this);
	},


})