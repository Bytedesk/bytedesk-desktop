/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-03 23:11:13
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-05 16:06:49
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
export default {
  // 工单表单
  'ticket.create.title': '创建工单',
  'ticket.edit.title': '编辑工单',
  'ticket.form.title': '标题',
  'ticket.form.title.required': '请输入工单标题',
  'ticket.form.title.placeholder': '请输入工单标题',
  'ticket.form.description': '描述',
  'ticket.form.description.required': '请输入工单描述',
  'ticket.form.description.placeholder': '请输入工单描述',
  'ticket.form.status': '状态',
  'ticket.form.status.required': '请选择工单状态',
  'ticket.form.priority': '优先级',
  'ticket.form.priority.required': '请选择优先级',
  'ticket.form.category': '分类',
  'ticket.form.category.required': '请选择工单分类',
  'ticket.form.category.placeholder': '请选择工单分类',
  'ticket.form.assignee': '处理人',
  'ticket.form.assignee.placeholder': '请选择处理人',
  'ticket.form.reporter': '报告人',
  'ticket.form.reporter.placeholder': '请选择报告人',
  'ticket.form.workgroup': '技能组',
  'ticket.form.workgroup.required': '请选择技能组',
  'ticket.form.workgroup.placeholder': '请选择技能组',
  'ticket.workgroup.load.error': '加载技能组失败',
  // 工单状态
  'ticket.status.all': '全部',
  'ticket.status.new': '新建',
  'ticket.status.assigned': '已分配',
  'ticket.status.in_progress': '处理中',
  'ticket.status.pending': '待处理',
  'ticket.status.on_hold': '挂起',
  'ticket.status.reopened': '重新打开',
  'ticket.status.resolved': '已解决',
  'ticket.status.closed': '已关闭',
  'ticket.status.cancelled': '已取消',
  // 工单优先级
  'ticket.priority.all': '全部',
  'ticket.priority.lowest': '最低',
  'ticket.priority.low': '低',
  'ticket.priority.medium': '中',
  'ticket.priority.high': '高',
  'ticket.priority.urgent': '紧急',
  'ticket.priority.critical': '严重',
  // 工单消息
  'ticket.create.success': '工单创建成功',
  'ticket.create.failed': '工单创建失败',
  'ticket.update.success': '工单更新成功',
  'ticket.update.failed': '工单更新失败',
  'ticket.submit.error': '工单提交失败',
  'ticket.delete.success': '工单删除成功',
  'ticket.delete.error': '工单删除失败',
  'ticket.load.error': '工单数据加载失败',
  // 工单列表
  'ticket.list.title': '工单列表',
  'ticket.list.empty': '暂无工单',
  'ticket.list.search.placeholder': '搜索工单',
  'ticket.list.filter.all': '全部工单',
  'ticket.list.filter.my': '我的工单',
  'ticket.list.filter.unassigned': '未分配',
  'ticket.list.create': '创建工单',
  'ticket.list.total': '工单总数',
  // 工单操作
  'ticket.action.edit': '编辑',
  'ticket.action.delete': '删除',
  'ticket.action.assign': '分配',
  'ticket.action.close': '关闭',
  'ticket.action.reopen': '重新打开',
  'ticket.delete.confirm': '确定要删除此工单吗？',
  'ticket.category.load.error': '加载工单分类失败',
  // 工单筛选
  'ticket.filter.by.status': '按状态筛选',
  'ticket.filter.by.priority': '按优先级筛选',
  'ticket.filter.by.assignment': '按分配筛选',
  'ticket.filter.by.time': '按时间筛选',
  // 
  'ticket.filter.all.assignment': '全部',
  'ticket.filter.my.tickets': '我的工单',
  'ticket.filter.unassigned': '未分配',
  'ticket.filter.my.workgroup': '我的技能组',
  'ticket.filter.my.created': '我创建的',
  'ticket.filter.my.assigned': '待我处理',
  // 
  'ticket.filter.all.time': '全部',
  'ticket.filter.today': '今天',
  'ticket.filter.yesterday': '昨天',
  'ticket.filter.this.week': '本周',
  'ticket.filter.last.week': '上周',
  'ticket.filter.this.month': '本月',
  'ticket.filter.last.month': '上月',
  // 工单布局
  'ticket.conversation.title': '工单对话',
  'ticket.conversation.empty': '请选择工单查看对话',
  'ticket.conversation.input.placeholder': '请输入消息...',
  'ticket.details.title': '工单详情',
  'ticket.details.empty': '请选择工单查看详情',
  'ticket.messages.load.error': '加载工单消息失败',
  'ticket.message.send.error': '发送消息失败',
  'ticket.form.thread': '关联会话',
  'ticket.form.thread.placeholder': '选择关联会话',
  // 
  'ticket.form.createdAt': '创建时间',
  'ticket.form.updatedAt': '更新时间',
  // 工单类型
  'ticket.type.agent': '指定客服',
  'ticket.type.workgroup': '技能组',
  // 工单分配人
  'ticket.assignee': '处理人',
  // 工单报告人
  'ticket.reporter': '报告人',
  // 工单类型
  'ticket.type': '类型',
  'ticket.category': '分类',
  'ticket.steps.title': '处理步骤',
  'ticket.form.upload.button': '上传附件',
  'ticket.upload.success': '文件上传成功',
  'ticket.upload.failed': '文件上传失败',
} 