/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-03 22:56:05
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-06 13:10:43
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
   // Ticket Form
   'ticket.create.title': 'Create Ticket',
   'ticket.edit.title': 'Edit Ticket',
   'ticket.form.title': 'Title',
   'ticket.form.title.required': 'Please enter ticket title',
   'ticket.form.title.placeholder': 'Enter ticket title',
   'ticket.form.description': 'Description',
   'ticket.form.description.required': 'Please enter ticket description',
   'ticket.form.description.placeholder': 'Enter ticket description',
   'ticket.form.status': 'Status',
   'ticket.form.status.required': 'Please select ticket status',
   'ticket.form.priority': 'Priority',
   'ticket.form.priority.required': 'Please select priority',
   'ticket.form.category': 'Category',
   'ticket.form.category.required': 'Please select category',
   'ticket.form.category.placeholder': 'Select category',
   'ticket.form.assignee': 'Assignee',
   'ticket.form.assignee.placeholder': 'Select assignee',
   'ticket.form.reporter': 'Reporter',
   'ticket.form.reporter.placeholder': 'Select reporter',
   'ticket.form.workgroup': 'Workgroup',
   'ticket.form.workgroup.required': 'Please select workgroup',
   'ticket.form.workgroup.placeholder': 'Select workgroup',
   'ticket.form.thread': 'Related Conversation',
   'ticket.form.thread.placeholder': 'Select related conversation',
   // Ticket Status
   'ticket.status.all': 'All Status',
   'ticket.status.new': 'New',
   'ticket.status.assigned': 'Assigned',
   'ticket.status.in_progress': 'In Progress',
   'ticket.status.pending': 'Pending',
   'ticket.status.on_hold': 'On Hold',
   'ticket.status.reopened': 'Reopened',
   'ticket.status.resolved': 'Resolved',
   'ticket.status.closed': 'Closed',
   'ticket.status.cancelled': 'Cancelled',
   // Ticket Priority
   'ticket.priority.all': 'All Priority',
   'ticket.priority.lowest': 'Lowest',
   'ticket.priority.low': 'Low',
   'ticket.priority.medium': 'Medium',
   'ticket.priority.high': 'High',
   'ticket.priority.urgent': 'Urgent',
   'ticket.priority.critical': 'Critical',
   // Ticket Messages
   'ticket.create.success': 'Ticket created successfully',
   'ticket.create.failed': 'Failed to create ticket',
   'ticket.update.success': 'Ticket updated successfully',
   'ticket.update.failed': 'Failed to update ticket',
   'ticket.submit.error': 'Failed to submit ticket',
   'ticket.delete.success': 'Ticket deleted successfully',
   'ticket.delete.error': 'Failed to delete ticket',
   'ticket.load.error': 'Failed to load tickets',
   'ticket.messages.load.error': 'Failed to load ticket messages',
   'ticket.message.send.error': 'Failed to send message',
   'ticket.workgroup.load.error': 'Failed to load workgroups',
   'ticket.category.load.error': 'Failed to load categories',
   // Ticket List
   'ticket.list.title': 'Tickets',
   'ticket.list.empty': 'No tickets found',
   'ticket.list.search.placeholder': 'Search tickets',
   'ticket.list.create': 'Create Ticket',
   'ticket.list.total': 'Total',
   
   // Ticket Actions
   'ticket.action.edit': 'Edit',
   'ticket.action.delete': 'Delete',
   'ticket.action.assign': 'Assign',
   'ticket.action.close': 'Close',
   'ticket.action.reopen': 'Reopen',
   'ticket.delete.confirm': 'Are you sure to delete this ticket?',
   // Ticket Filters
   'ticket.filter.by.status': 'Filter by Status',
   'ticket.filter.by.priority': 'Filter by Priority',
   'ticket.filter.by.assignment': 'Filter by Assignment',
   'ticket.filter.by.time': 'Filter by Time',
   // 
   'ticket.filter.assignment_all': 'All',
   'ticket.filter.my.tickets': 'My Tickets',
   'ticket.filter.unassigned': 'Unassigned',
   'ticket.filter.my.workgroup': 'My Workgroup',
   'ticket.filter.my.created': 'My Created',
   'ticket.filter.my.assigned': 'My Assigned',
   // 
   'ticket.filter.all.time': 'All',
   'ticket.filter.today': 'Today',
   'ticket.filter.yesterday': 'Yesterday',
   'ticket.filter.this.week': 'This Week',
   'ticket.filter.last.week': 'Last Week',
   'ticket.filter.this.month': 'This Month',
   'ticket.filter.last.month': 'Last Month',
   // Ticket Layout
   'ticket.conversation.title': 'Conversation',
   'ticket.conversation.empty': 'Select a ticket to view conversation',
   'ticket.conversation.input.placeholder': 'Type your message...',
   'ticket.details.title': 'Ticket Details',
   'ticket.details.empty': 'Select a ticket to view details',
   // 
   'ticket.form.createdAt': 'Created At',
   'ticket.form.updatedAt': 'Updated At',
   // Ticket Type
   'ticket.type.agent': 'Agent',
   'ticket.type.workgroup': 'Workgroup',
   // 
   'ticket.type': 'Type',
   'ticket.assignee': 'Assignee',
   'ticket.reporter': 'Reporter',
   'ticket.category': 'Category',
   'ticket.steps.title': 'Processing Steps',
   'ticket.form.upload.button': 'Upload Attachments',
   'ticket.upload.success': 'File uploaded successfully',
   'ticket.upload.failed': 'File upload failed',
   'ticket.current.filters': 'Current Filters',
   'ticket.filter.all': 'All Tickets',
   'ticket.filter.my_tickets': 'My Tickets',
   'ticket.filter.my_workgroup': 'My Workgroup',
   'ticket.filter.my_created': 'Created by Me',
   'ticket.filter.my_assigned': 'Assigned to Me',
   'ticket.filter.all_time': 'All Time',
   'ticket.filter.this_week': 'This Week',
   'ticket.filter.last_week': 'Last Week',
   'ticket.filter.this_month': 'This Month',
   'ticket.filter.last_month': 'Last Month',
   // Filter translations
   'ticket.filter.status_all': 'All Status',
   'ticket.filter.status_new': 'New',
   'ticket.filter.status_assigned': 'Assigned',
   'ticket.filter.status_in_progress': 'In Progress',
   'ticket.filter.status_pending': 'Pending',
   'ticket.filter.status_on_hold': 'On Hold',
   'ticket.filter.status_reopened': 'Reopened',
   'ticket.filter.status_resolved': 'Resolved',
   'ticket.filter.status_closed': 'Closed',
   'ticket.filter.status_cancelled': 'Cancelled',
   'ticket.filter.priority_all': 'All Priority',
   'ticket.filter.priority_lowest': 'Lowest',
   'ticket.filter.priority_low': 'Low',
   'ticket.filter.priority_medium': 'Medium',
   'ticket.filter.priority_high': 'High',
   'ticket.filter.priority_urgent': 'Urgent',
   'ticket.filter.priority_critical': 'Critical',
} 