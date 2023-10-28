/**
 * Notes:服务者控制器模块
 * Ver : CCMiniCloud Framework 2.0.3 ALL RIGHTS RESERVED BY cclinuX0730 (wechat)
 * Date: 2023-01-16 19:20:00 
 */

const BaseProjectWorkController = require('./base_project_work_controller.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const WorkTaskService = require('../../service/work/work_task_service.js');
const TaskService = require('../../service/task_service.js');
const contentCheck = require('../../../../framework/validate/content_check.js');

class WorkTaskController extends BaseProjectWorkController {
	/** 信息 */
	async getWorkTaskDetail() {
		await this.isWork();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new WorkTaskService();
		let task = await service.getWorkTaskDetail(this._workId, input.id);

		if (task) {
			// 显示转换  
			task.TASK_ADD_TIME = timeUtil.timestamp2Time(task.TASK_ADD_TIME);
			task.TASK_MEMBER_TIME = timeUtil.timestamp2Time(task.TASK_MEMBER_TIME);
			task.TASK_COMMENT_TIME = timeUtil.timestamp2Time(task.TASK_COMMENT_TIME); 
			 
		} 

		return task;
	}


	/** 列表 */
	async getWorkTaskList() {
		await this.isWork();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new WorkTaskService();
		let result = await service.getWorkTaskList(this._workId, input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].TASK_ADD_TIME = timeUtil.timestamp2Time(list[k].TASK_ADD_TIME);
		}
		result.list = list;
		return result;
	}

	async runWorkTask() {
		await this.isWork();

		// 数据校验
		let rules = {
			id: 'must|id',
			forms: 'array|name=表单',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new WorkTaskService();
		return await service.runWorkTask(input.id, input.forms);
	}

	async overWorkTask() {
		await this.isWork();

		// 数据校验
		let rules = {
			id: 'must|id',
			forms: 'array|name=表单',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new WorkTaskService();
		return await service.overWorkTask(input.id, input.forms);
	}

	async updateWorkRunTaskForms() {
		await this.isWork();

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new TaskService();
		return await service.updateTaskForms(input, 'TASK_RUN_FORMS', 'TASK_RUN_OBJ');
	}

	async updateWorkOverTaskForms() {
		await this.isWork();

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new TaskService();
		return await service.updateTaskForms(input, 'TASK_OVER_FORMS', 'TASK_OVER_OBJ');
	}
}

module.exports = WorkTaskController;