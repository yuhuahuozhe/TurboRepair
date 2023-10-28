const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const MonitorBiz = require('../../../../biz/monitor_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,

		curMemberCateId: 1,
		apptList: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		if (!pageHelper.getOptions(this, options)) return;

		this.setData({
			cateList: projectSetting.MEMBER_CATE
		});

		this._loadList();
	},

	bindMemberApptTap: function (e) {
		let id = pageHelper.dataset(e, 'id');
		let list = this.data.list;
		for (let k = 0; k < list.length; k++) {
			if (id == list[k]._id) list[k].selected = !list[k].selected;
		}
		this.setData({ list });
	},

	_loadList: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let id = this.data.id;
		if (!id) return;

		let params = {
			id
		};
		let opt = {
			title: 'bar'
		};
		await cloudHelper.callCloudSumbit('admin/monitor_member_list', params, opt).then(res => {
			this.setData({
				list: res.data,
				isLoad: true
			});
		});

	},

	bindMemberTabTap: function (e) {
		let curMemberCateId = pageHelper.dataset(e, 'id');
		if (curMemberCateId != '') {
			this.setData({
				curMemberCateId
			});
		}

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () { },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () { },

	onPullDownRefresh: async function () {
		await this._loadList();
		wx.stopPullDownRefresh();
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () { },

	bindApptTap: async function (e) {
		try {
			let data = [];
			let list = this.data.list;
			for (let k = 0; k < list.length; k++) {
				if (list[k].selected) data.push(list[k]);
			}
			let params = {
				id: this.data.id,
				data
			}
			let options = { title: '提交中' }
			await cloudHelper.callCloudSumbit('admin/monitor_member_save', params, options).then(res => {
				// 更新列表页面数据
				let node = {
					'MONITOR_MEMBER_CNT': data.length,
				}
				pageHelper.modifyPrevPageListNodeObject(this.data.id, node);

				pageHelper.showSuccToast('分配成功');
			})
		}
		catch (err) {
			console.error(err)
		}
	}


})