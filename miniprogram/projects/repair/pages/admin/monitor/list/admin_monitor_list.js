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
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		wx.setNavigationBarTitle({
			title: projectSetting.MONITOR_NAME + '-管理',
		});
		this.setData({
			MONITOR_NAME: projectSetting.MONITOR_NAME
		});

		//设置搜索菜单
		this._getSearchMenu();

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

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () { },

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	bindJoinMoreTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let itemList = ['报名名单管理', '导出名单Excel表格', '管理员核销报名码', '获取用户自助签到码', '清空报名数据'];

		let monitorId = pageHelper.dataset(e, 'id');
		let title = encodeURIComponent(pageHelper.dataset(e, 'title'));

		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: {
						wx.navigateTo({
							url: '../join_list/admin_monitor_join_list?monitorId=' + monitorId + '&title=' + title,
						});
						break;
					}
					case 1: {
						wx.navigateTo({
							url: '../export/admin_monitor_export?monitorId=' + monitorId + '&title=' + title,
						});
						break;
					}
					case 2: {
						wx.navigateTo({
							url: '../scan/admin_monitor_scan?monitorId=' + monitorId + '&title=' + title,
						});
						break;
					}
					case 3: {
						wx.navigateTo({
							url: '../self/admin_monitor_self?monitorId=' + monitorId + '&title=' + title,
						});
						break;
					}
					case 4: {
						this._clear(e);
					}
				}
			},
			fail: function (res) { }
		})
	},

	_clear: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '处理中'
				}
				await cloudHelper.callCloudSumbit('admin/monitor_clear', params, opts).then(res => {
					let node = {
						'MONITOR_JOIN_CNT': 0,
					}
					pageHelper.modifyPrevPageListNodeObject(id, node, 1);

					pageHelper.showSuccToast('清空完成');
				});
			} catch (err) {
				console.log(err);
			}
		}
		pageHelper.showConfirm('确认清空所有数据？清空后不可恢复', callback);

	},

	bindStatusMoreTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let itemList = ['启用', '停用 (不显示)', '删除'];
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //启用
						e.currentTarget.dataset['status'] = 1;
						await this._setStatus(e);
						break;
					}
					case 1: { //停止 
						e.currentTarget.dataset['status'] = 0;
						await this._setStatus(e);
						break;
					}
					case 2: { //删除
						await this._del(e);
						break;
					}
				}
			},
			fail: function (res) { }
		})
	}, 

	_setSort: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;

		let id = pageHelper.dataset(e, 'id');
		let sort = pageHelper.dataset(e, 'sort');
		if (!id) return;

		let params = {
			id,
			sort
		}

		try {
			await cloudHelper.callCloudSumbit('admin/monitor_sort', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'MONITOR_ORDER', sort);
				this.setData({
					dataList: this.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (err) {
			console.log(err);
		}
	},

	_setVouch: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;

		let id = pageHelper.dataset(e, 'id');
		let vouch = pageHelper.dataset(e, 'vouch');
		if (!id) return;

		let params = {
			id,
			vouch
		}

		try {
			await cloudHelper.callCloudSumbit('admin/monitor_vouch', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'MONITOR_VOUCH', vouch);
				this.setData({
					dataList: this.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (err) {
			console.log(err);
		}
	},

	_del: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('admin/monitor_del', params, opts).then(res => {
					pageHelper.delListNode(id, this.data.dataList.list, '_id');
					this.data.dataList.total--;
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				});
			} catch (err) {
				console.log(err);
			}
		}
		pageHelper.showConfirm('确认删除？删除后报名数据将一并删除且不可恢复', callback);

	},

	_setStatus: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');
		let status = Number(pageHelper.dataset(e, 'status'));
		let params = {
			id,
			status
		}

		try {
			await cloudHelper.callCloudSumbit('admin/monitor_status', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'MONITOR_STATUS', status, '_id');
				pageHelper.modifyListNode(id, this.data.dataList.list, 'statusDesc', res.data.statusDesc, '_id');
				this.setData({
					dataList: this.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (err) {
			console.log(err);
		}
	},

	_getSearchMenu: function () {
		let cateIdOptions = MonitorBiz.getCateList();

		let sortItem1 = [{ label: '分类', type: '', value: 0 }];
		sortItem1 = sortItem1.concat(cateIdOptions);
 

		let sortItems = [];
		if (sortItem1.length > 2) sortItems.push(sortItem1); 

		let sortMenus = [ 
		]
		this.setData({
			search: '',
			cateIdOptions,
			sortItems,
			sortMenus,
			isLoad: true
		})
	}

})