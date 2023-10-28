const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,

		curDetail: 'detail',

		curMemberId: '',
		curMemberCateId: 1,
		showMemberModal: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		if (!AdminBiz.isAdmin(this)) return;
		if (!pageHelper.getOptions(this, options)) return;
		pageHelper.getOptions(this, options, 'idx');

		this.setData({
			cateList: projectSetting.MEMBER_CATE
		});
		this._loadDetail();
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
		await this._loadDetail();
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

	_loadDetail: async function (title = 'bar') {
		if (!AdminBiz.isAdmin(this)) return;

		let id = this.data.id;
		if (!id) return;

		let params = {
			id
		}
		let opts = {
			title
		}
		let task = await cloudHelper.callCloudData('admin/task_detail', params, opts);
		if (!task) {
			this.setData({
				isLoad: null,
			})
			return;
		};

		this.setData({
			isLoad: true,
			task,
			memberList: task.memberList,
		})

		if (task.TASK_MEMBER_ID) {
			this.setData({
				curMemberId: task.TASK_MEMBER_ID,
				curMemberCateId: task.TASK_MEMBER_CATE_ID
			})
		}
	},
	url(e) {
		pageHelper.url(e, this);
	},

	bindMemberTabTap: function (e) {
		let curMemberCateId = pageHelper.dataset(e, 'id');
		if (curMemberCateId != '') {
			this.setData({
				curMemberCateId
			});
		}

	},

	bindMemberApptTap: async function (e) {
		let curMemberId = pageHelper.dataset(e, 'id');
		let cb = async () => {
			try {
				let params = {
					taskId: this.data.task._id,
					memberId: curMemberId,
				}
				let options = {
					title: '派工中'
				}
				await cloudHelper.callCloudSumbit('admin/task_appt_member', params, options).then(res => {
					let cb = async () => {

						await this._loadDetail('加载中');
						let idx = this.data.idx;

						// 更新列表页面数据
						let parent = pageHelper.getPrevPage(2);
						if (parent) {
							parent.setData({
								['dataList.list[' + idx + '].TASK_MEMBER_NAME']: this.data.task.TASK_MEMBER_NAME,
								['dataList.list[' + idx + '].TASK_MEMBER_CATE_NAME']: this.data.task.TASK_MEMBER_CATE_NAME,
								['dataList.list[' + idx + '].TASK_STATUS']: 1,
							})
						}


						this.setData({
							curMemberId,
							showMemberModal: false,
						});
					}
					pageHelper.showSuccToast('派工成功', 1500, cb);
				})
			}
			catch (err) {
				console.error(err);
			}

		}
		pageHelper.showConfirm('确认指派该工作人员？', cb);

	},

	bindShowMemberModalTap: function (e) {
		this.setData({ showMemberModal: true })
	},

	bindHideMemberModalTap: function (e) {
		this.setData({ showMemberModal: false })
	}
})