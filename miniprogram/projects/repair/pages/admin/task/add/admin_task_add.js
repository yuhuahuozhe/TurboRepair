const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const TaskBiz = require('../../../../biz/task_biz.js');
const PublicBiz = require('../../../../../../comm/biz/public_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: { 

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		if (!AdminBiz.isAdmin(this)) return;  
		
		this.setData(TaskBiz.initFormData('')); // 初始化表单数据   
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

	bindCheckTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		this.selectComponent("#task-form-show").checkForms();
	},

	bindSubmitCmpt: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;

		let forms = e.detail;

		let callback = async () => {
			try {
				let opts = {
					title: '提交中'
				}
				let params = {
					forms, 
				}
				// 创建
				let result = await cloudHelper.callCloudSumbit('admin/task_insert', params, opts);
				let taskId = result.data.id;

				// 图片
				await cloudHelper.transFormsTempPics(forms, 'task/', taskId, 'admin/task_update_forms');

				let cb = () => {
					PublicBiz.removeCacheList('admin-task-list');
					wx.redirectTo({
						url: '../detail/admin_task_detail?id=' + taskId,
					});
				}
				pageHelper.showNoneToast('录入完成，请指派工作人员处理', 2000, cb);


			} catch (err) {
				console.log(err);
			};
		}


		callback();
	},
})