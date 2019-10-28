const BASE_URL = 'https://app.kalosflorida.com/index.cfm';
const KALOS_ROOT = 'kalos-prod:/opt/coldfusion11/cfusion/wwwroot';
const KALOS_ASSETS = `${KALOS_ROOT}/app/assets`;
const MODULE_CFC = `${KALOS_ROOT}/app/admin/controllers/module.cfc`;
const MODULE_CFM = `${KALOS_ROOT}/app/admin/views/module`;
const NAMED_EXPORTS = {
  'node_modules/@improbable-eng/grpc-web/dist/grpc-web-client.js': ['grpc'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/S3_pb.js': [
    'FileObject',
    'BucketObject',
    'S3Files',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/activity_log_pb.js': [
    'ActivityLog',
    'ActivityLogList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/api_key_pb.js': [
    'ApiKey',
    'ApiKeyList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/auth_pb.js': ['AuthData'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/call_association_pb.js': [
    'CallAssociation',
    'CallAssociationList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/contract_pb.js': [
    'Contract',
    'ContractList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/default_view_pb.js': [
    'DefaultView',
    'DefaultViewList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/document_pb.js': [
    'Document',
    'DocumentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/employee_function_pb.js': [
    'EmployeeFunction',
    'EmployeeFunctionList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/event_pb.js': [
    'Event',
    'EventList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/event_assignment_pb.js': [
    'EventAssignment',
    'EventAssignmentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/event_deletion_pb.js': [
    'EventDeletion',
    'EventDeletionList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/files_pb.js': [
    'File',
    'FileList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/first_calls_pb.js': [
    'FirstCalls',
    'FirstCallsList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/internal_document_pb.js': [
    'InternalDocument',
    'InternalDocumentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/invoice_pb.js': [
    'Invoice',
    'InvoiceList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/job_type_subtype_pb.js': [
    'JobTypeSubtype',
    'JobTypeSubtypeList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/logger_pb.js': [
    'Logger',
    'LoggerList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/maintenance_question_pb.js': [
    'MaintenanceQuestion',
    'MaintenanceQuestionList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/material_pb.js': [
    'Material',
    'MaterialList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/menu_option_pb.js': [
    'MenuOption',
    'MenuOptionList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/payment_pb.js': [
    'Payment',
    'PaymentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/phone_call_log_pb.js': [
    'PhoneCallLog',
    'PhoneCallLogList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/phone_call_log_detail_pb.js': [
    'PhoneCallLogDetail',
    'PhoneCallLogDetailList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/prompt_payment_override_pb.js': [
    'PromptPaymentOverride',
    'PromptPaymentOverrideList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/prompt_payment_rebate_pb.js': [
    'PromptPaymentRebate',
    'PromptPaymentRebateList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/prop_link_pb.js': [
    'PropLink',
    'PropLinkList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/property_pb.js': [
    'Property',
    'PropertyList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/quote_pb.js': [
    'Quote',
    'QuoteList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/quote_document_pb.js': [
    'QuoteDocument',
    'QuoteDocumentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/quote_line_pb.js': [
    'QuoteLine',
    'QuoteLineList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/quote_line_part_pb.js': [
    'QuoteLinePart',
    'QuoteLinePartList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/quote_part_pb.js': [
    'QuotePart',
    'QuotePartList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/quote_used_pb.js': [
    'QuoteUsed',
    'QuoteUsedList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/reading_pb.js': [
    'Reading',
    'ReadingList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/remote_identity_pb.js': [
    'RemoteIdentity',
    'RemoteIdentityList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_item_pb.js': [
    'ServiceItem',
    'ServiceItemList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_item_image_pb.js': [
    'ServiceItemImage',
    'ServiceItemImageList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_item_material_pb.js': [
    'ServiceItemMaterial',
    'ServiceItemMaterialList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_item_unit_pb.js': [
    'ServiceItemUnit',
    'ServiceItemUnitList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_reading_line_pb.js': [
    'ServiceReadingLine',
    'ServiceReadingLineList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/services_rendered_pb.js': [
    'ServicesRendered',
    'ServicesRenderedList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/si_link_pb.js': [
    'SiLink',
    'SiLinkList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/spiff_tool_admin_action_pb.js': [
    'SpiffToolAdminAction',
    'SpiffToolAdminActionList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/stock_vendor_pb.js': [
    'StockVendor',
    'StockVendorList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/stored_quotes_pb.js': [
    'StoredQuotes',
    'StoredQuotesList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/system_invoice_type_pb.js': [
    'SystemInvoiceType',
    'SystemInvoiceTypeList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/system_readings_type_pb.js': [
    'SystemReadingsType',
    'SystemReadingsTypeList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/task_pb.js': [
    'Task',
    'TaskList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/task_assignment_pb.js': [
    'TaskAssignment',
    'TaskAssignmentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/task_event_pb.js': [
    'TaskEvent',
    'TaskEventList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/technician_skills_pb.js': [
    'TechnicianSkills',
    'TechnicianSkillsList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/timeoff_request_pb.js': [
    'TimeoffRequest',
    'TimeoffRequestList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/timesheet_line_pb.js': [
    'TimesheetLine',
    'TimesheetLineList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/timesheet_department_pb.js': [
    'TimesheetDepartment',
    'TimesheetDepartmentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_pb.js': [
    'Transaction',
    'TransactionList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_account_pb.js': [
    'TransactionAccount',
    'TransactionAccountList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_activity_pb.js': [
    'TransactionActivity',
    'TransactionActivityList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_document_pb.js': [
    'TransactionDocument',
    'TransactionDocumentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/user_group_link_pb.js': [
    'UserGroupLink',
    'UserGroupLinkList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/user_pb.js': [
    'User',
    'UserList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/vendor_order_pb.js': [
    'VendorOrder',
    'VendorOrderList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/vendor_pb.js': [
    'Vendor',
    'VendorList',
  ],
  'node_modules/react-is/index.js': ['ForwardRef'],
  'node_modules/prop-types/index.js': ['elementType'],
};

module.exports = {
  KALOS_ROOT,
  KALOS_ASSETS,
  NAMED_EXPORTS,
  MODULE_CFC,
  MODULE_CFM,
};
