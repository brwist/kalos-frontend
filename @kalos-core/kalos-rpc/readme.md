# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [activity_log.proto](#activity_log.proto)
    - [ActivityLog](#.ActivityLog)
    - [ActivityLogList](#.ActivityLogList)
  
  
  
    - [ActivityLogService](#.ActivityLogService)
  

- [api_key.proto](#api_key.proto)
    - [ApiKey](#.ApiKey)
    - [ApiKeyList](#.ApiKeyList)
  
  
  
    - [ApiKeyService](#.ApiKeyService)
  

- [auth.proto](#auth.proto)
    - [AuthData](#.AuthData)
    - [Token](#.Token)
  
  
  
    - [AuthService](#.AuthService)
  

- [call_association.proto](#call_association.proto)
    - [CallAssociation](#.CallAssociation)
    - [CallAssociationList](#.CallAssociationList)
  
  
  
    - [CallAssociationService](#.CallAssociationService)
  

- [common.proto](#common.proto)
    - [DateRange](#.DateRange)
    - [Double](#.Double)
    - [Empty](#.Empty)
    - [Int32](#.Int32)
    - [Int32List](#.Int32List)
    - [String](#.String)
    - [StringList](#.StringList)
  
  
  
  

- [contract.proto](#contract.proto)
    - [Contract](#.Contract)
    - [ContractList](#.ContractList)
  
  
  
    - [ContractService](#.ContractService)
  

- [contract_frequency.proto](#contract_frequency.proto)
    - [ContractFrequency](#.ContractFrequency)
    - [ContractFrequencyList](#.ContractFrequencyList)
  
  
  
    - [ContractFrequencyService](#.ContractFrequencyService)
  

- [default_view.proto](#default_view.proto)
    - [DefaultView](#.DefaultView)
    - [DefaultViewList](#.DefaultViewList)
  
  
  
    - [DefaultViewService](#.DefaultViewService)
  

- [document.proto](#document.proto)
    - [Document](#.Document)
    - [DocumentList](#.DocumentList)
  
  
  
    - [DocumentService](#.DocumentService)
  

- [email.proto](#email.proto)
    - [Email](#.Email)
  
  
  
    - [EmailService](#.EmailService)
  

- [employee_function.proto](#employee_function.proto)
    - [EmployeeFunction](#.EmployeeFunction)
    - [EmployeeFunctionList](#.EmployeeFunctionList)
  
  
  
    - [EmployeeFunctionService](#.EmployeeFunctionService)
  

- [event.proto](#event.proto)
    - [CalendarData](#.CalendarData)
    - [CalendarData.CustomersEntry](#.CalendarData.CustomersEntry)
    - [CalendarData.DatesEntry](#.CalendarData.DatesEntry)
    - [CalendarData.ZipCodesEntry](#.CalendarData.ZipCodesEntry)
    - [CalendarDay](#.CalendarDay)
    - [Event](#.Event)
    - [EventList](#.EventList)
    - [Quotable](#.Quotable)
    - [QuotableList](#.QuotableList)
  
  
  
    - [EventService](#.EventService)
  

- [event_assignment.proto](#event_assignment.proto)
    - [EventAssignment](#.EventAssignment)
    - [EventAssignmentList](#.EventAssignmentList)
  
  
  
    - [EventAssignmentService](#.EventAssignmentService)
  

- [event_deletion.proto](#event_deletion.proto)
    - [EventDeletion](#.EventDeletion)
    - [EventDeletionList](#.EventDeletionList)
  
  
  
    - [EventDeletionService](#.EventDeletionService)
  

- [file.proto](#file.proto)
    - [File](#.File)
    - [FileList](#.FileList)
  
  
  
    - [FileService](#.FileService)
  

- [first_call.proto](#first_call.proto)
    - [FirstCall](#.FirstCall)
    - [FirstCallList](#.FirstCallList)
  
  
  
    - [FirstCallService](#.FirstCallService)
  

- [group.proto](#group.proto)
    - [Group](#.Group)
    - [GroupList](#.GroupList)
  
  
  
    - [GroupService](#.GroupService)
  

- [internal_document.proto](#internal_document.proto)
    - [DocumentKey](#.DocumentKey)
    - [DocumentKeyList](#.DocumentKeyList)
    - [InternalDocument](#.InternalDocument)
    - [InternalDocumentList](#.InternalDocumentList)
  
  
  
    - [InternalDocumentService](#.InternalDocumentService)
  

- [invoice.proto](#invoice.proto)
    - [Invoice](#.Invoice)
    - [InvoiceList](#.InvoiceList)
  
  
  
    - [InvoiceService](#.InvoiceService)
  

- [job_subtype.proto](#job_subtype.proto)
    - [JobSubtype](#.JobSubtype)
    - [JobSubtypeList](#.JobSubtypeList)
  
  
  
    - [JobSubtypeService](#.JobSubtypeService)
  

- [job_type.proto](#job_type.proto)
    - [JobType](#.JobType)
    - [JobTypeList](#.JobTypeList)
  
  
  
    - [JobTypeService](#.JobTypeService)
  

- [job_type_subtype.proto](#job_type_subtype.proto)
    - [JobTypeSubtype](#.JobTypeSubtype)
    - [JobTypeSubtypeList](#.JobTypeSubtypeList)
  
  
  
    - [JobTypeSubtypeService](#.JobTypeSubtypeService)
  

- [kalosmaps.proto](#kalosmaps.proto)
    - [Coordinates](#.Coordinates)
    - [CoordinatesList](#.CoordinatesList)
    - [MatrixRequest](#.MatrixRequest)
    - [Place](#.Place)
    - [Places](#.Places)
    - [TripData](#.TripData)
    - [TripData.HumanReadableTime](#.TripData.HumanReadableTime)
  
  
  
    - [MapService](#.MapService)
  

- [logger.proto](#logger.proto)
    - [Logger](#.Logger)
    - [LoggerList](#.LoggerList)
  
  
  
    - [LoggerService](#.LoggerService)
  

- [maintenance_question.proto](#maintenance_question.proto)
    - [MaintenanceQuestion](#.MaintenanceQuestion)
    - [MaintenanceQuestionList](#.MaintenanceQuestionList)
  
  
  
    - [MaintenanceQuestionService](#.MaintenanceQuestionService)
  

- [material.proto](#material.proto)
    - [Material](#.Material)
    - [MaterialList](#.MaterialList)
  
  
  
    - [MaterialService](#.MaterialService)
  

- [metrics.proto](#metrics.proto)
    - [AvgTicket](#.AvgTicket)
    - [Billable](#.Billable)
    - [Callbacks](#.Callbacks)
    - [Revenue](#.Revenue)
  
  
  
    - [MetricsService](#.MetricsService)
  

- [payment.proto](#payment.proto)
    - [Payment](#.Payment)
    - [PaymentList](#.PaymentList)
  
  
  
    - [PaymentService](#.PaymentService)
  

- [pdf.proto](#pdf.proto)
    - [HTML](#.HTML)
  
  
  
    - [PDFService](#.PDFService)
  

- [pending_billing.proto](#pending_billing.proto)
    - [PendingBilling](#.PendingBilling)
    - [PendingBillingList](#.PendingBillingList)
  
  
  
    - [PendingBillingService](#.PendingBillingService)
  

- [perdiem.proto](#perdiem.proto)
    - [PerDiem](#.PerDiem)
    - [PerDiemList](#.PerDiemList)
    - [PerDiemReportRequest](#.PerDiemReportRequest)
    - [PerDiemRow](#.PerDiemRow)
    - [PerDiemRowList](#.PerDiemRowList)
  
  
  
    - [PerDiemService](#.PerDiemService)
  

- [phone_call_log.proto](#phone_call_log.proto)
    - [PhoneCallLog](#.PhoneCallLog)
    - [PhoneCallLogList](#.PhoneCallLogList)
  
  
  
    - [PhoneCallLogService](#.PhoneCallLogService)
  

- [predict.proto](#predict.proto)
    - [Prediction](#.Prediction)
    - [Prediction.PredictedScoresEntry](#.Prediction.PredictedScoresEntry)
    - [TransactionData](#.TransactionData)
  
  
  
    - [PredictService](#.PredictService)
  

- [prompt_payment_override.proto](#prompt_payment_override.proto)
    - [PromptPaymentOverride](#.PromptPaymentOverride)
    - [PromptPaymentOverrideList](#.PromptPaymentOverrideList)
  
  
  
    - [PromptPaymentOverrideService](#.PromptPaymentOverrideService)
  

- [prompt_payment_rebate.proto](#prompt_payment_rebate.proto)
    - [PromptPaymentRebate](#.PromptPaymentRebate)
    - [PromptPaymentRebateList](#.PromptPaymentRebateList)
  
  
  
    - [PromptPaymentRebateService](#.PromptPaymentRebateService)
  

- [prop_link.proto](#prop_link.proto)
    - [PropLink](#.PropLink)
    - [PropLinkList](#.PropLinkList)
  
  
  
    - [PropLinkService](#.PropLinkService)
  

- [property.proto](#property.proto)
    - [Property](#.Property)
    - [PropertyList](#.PropertyList)
  
  
  
    - [PropertyService](#.PropertyService)
  

- [quote.proto](#quote.proto)
    - [Quote](#.Quote)
    - [QuoteList](#.QuoteList)
  
  
  
    - [QuoteService](#.QuoteService)
  

- [quote_document.proto](#quote_document.proto)
    - [QuoteDocument](#.QuoteDocument)
    - [QuoteDocumentList](#.QuoteDocumentList)
  
  
  
    - [QuoteDocumentService](#.QuoteDocumentService)
  

- [quote_line.proto](#quote_line.proto)
    - [QuoteLine](#.QuoteLine)
    - [QuoteLineList](#.QuoteLineList)
  
  
  
    - [QuoteLineService](#.QuoteLineService)
  

- [quote_line_part.proto](#quote_line_part.proto)
    - [QuoteLinePart](#.QuoteLinePart)
    - [QuoteLinePartList](#.QuoteLinePartList)
  
  
  
    - [QuoteLinePartService](#.QuoteLinePartService)
  

- [quote_part.proto](#quote_part.proto)
    - [QuotePart](#.QuotePart)
    - [QuotePartList](#.QuotePartList)
  
  
  
    - [QuotePartService](#.QuotePartService)
  

- [quote_used.proto](#quote_used.proto)
    - [QuoteUsed](#.QuoteUsed)
    - [QuoteUsedList](#.QuoteUsedList)
  
  
  
    - [QuoteUsedService](#.QuoteUsedService)
  

- [reading.proto](#reading.proto)
    - [Reading](#.Reading)
    - [ReadingList](#.ReadingList)
  
  
  
    - [ReadingService](#.ReadingService)
  

- [remote_identity.proto](#remote_identity.proto)
    - [RemoteIdentity](#.RemoteIdentity)
    - [RemoteIdentityList](#.RemoteIdentityList)
  
  
  
    - [RemoteIdentityService](#.RemoteIdentityService)
  

- [reports.proto](#reports.proto)
    - [PromptPaymentReport](#.PromptPaymentReport)
    - [PromptPaymentReportLine](#.PromptPaymentReportLine)
    - [SpiffReport](#.SpiffReport)
    - [SpiffReportData](#.SpiffReportData)
    - [SpiffReportLine](#.SpiffReportLine)
  
  
  
    - [ReportService](#.ReportService)
  

- [s3.proto](#s3.proto)
    - [BucketObject](#.BucketObject)
    - [FileObject](#.FileObject)
    - [FileObjects](#.FileObjects)
    - [MoveConfig](#.MoveConfig)
    - [URLObject](#.URLObject)
  
    - [ACL](#.ACL)
  
  
    - [BucketService](#.BucketService)
    - [S3Service](#.S3Service)
  

- [service_item.proto](#service_item.proto)
    - [ServiceItem](#.ServiceItem)
    - [ServiceItemList](#.ServiceItemList)
  
  
  
    - [ServiceItemService](#.ServiceItemService)
  

- [service_item_image.proto](#service_item_image.proto)
    - [ServiceItemImage](#.ServiceItemImage)
    - [ServiceItemImageList](#.ServiceItemImageList)
  
  
  
    - [ServiceItemImageService](#.ServiceItemImageService)
  

- [service_item_material.proto](#service_item_material.proto)
    - [ServiceItemMaterial](#.ServiceItemMaterial)
    - [ServiceItemMaterialList](#.ServiceItemMaterialList)
  
  
  
    - [ServiceItemMaterialService](#.ServiceItemMaterialService)
  

- [service_item_unit.proto](#service_item_unit.proto)
    - [ServiceItemUnit](#.ServiceItemUnit)
    - [ServiceItemUnitList](#.ServiceItemUnitList)
  
  
  
    - [ServiceItemUnitService](#.ServiceItemUnitService)
  

- [service_reading_line.proto](#service_reading_line.proto)
    - [ServiceReadingLine](#.ServiceReadingLine)
    - [ServiceReadingLineList](#.ServiceReadingLineList)
  
  
  
    - [ServiceReadingLineService](#.ServiceReadingLineService)
  

- [services_rendered.proto](#services_rendered.proto)
    - [ServicesRendered](#.ServicesRendered)
    - [ServicesRenderedList](#.ServicesRenderedList)
  
  
  
    - [ServicesRenderedService](#.ServicesRenderedService)
  

- [si_link.proto](#si_link.proto)
    - [SiLink](#.SiLink)
    - [SiLinkList](#.SiLinkList)
  
  
  
    - [SiLinkService](#.SiLinkService)
  

- [spiff_tool_admin_action.proto](#spiff_tool_admin_action.proto)
    - [SpiffToolAdminAction](#.SpiffToolAdminAction)
    - [SpiffToolAdminActionList](#.SpiffToolAdminActionList)
  
  
  
    - [SpiffToolAdminActionService](#.SpiffToolAdminActionService)
  

- [stock_vendor.proto](#stock_vendor.proto)
    - [StockVendor](#.StockVendor)
    - [StockVendorList](#.StockVendorList)
  
  
  
    - [StockVendorService](#.StockVendorService)
  

- [stored_quote.proto](#stored_quote.proto)
    - [StoredQuote](#.StoredQuote)
    - [StoredQuoteList](#.StoredQuoteList)
  
  
  
    - [StoredQuoteService](#.StoredQuoteService)
  

- [system_invoice_type.proto](#system_invoice_type.proto)
    - [SystemInvoiceType](#.SystemInvoiceType)
    - [SystemInvoiceTypeList](#.SystemInvoiceTypeList)
  
  
  
    - [SystemInvoiceTypeService](#.SystemInvoiceTypeService)
  

- [system_readings_type.proto](#system_readings_type.proto)
    - [SystemReadingsType](#.SystemReadingsType)
    - [SystemReadingsTypeList](#.SystemReadingsTypeList)
  
  
  
    - [SystemReadingsTypeService](#.SystemReadingsTypeService)
  

- [task.proto](#task.proto)
    - [ProjectTask](#.ProjectTask)
    - [ProjectTaskList](#.ProjectTaskList)
    - [Spiff](#.Spiff)
    - [SpiffDuplicate](#.SpiffDuplicate)
    - [SpiffList](#.SpiffList)
    - [SpiffType](#.SpiffType)
    - [SpiffTypeList](#.SpiffTypeList)
    - [Task](#.Task)
    - [TaskBillableTypeList](#.TaskBillableTypeList)
    - [TaskEventData](#.TaskEventData)
    - [TaskList](#.TaskList)
    - [TaskPriority](#.TaskPriority)
    - [TaskPriorityList](#.TaskPriorityList)
    - [TaskStatus](#.TaskStatus)
    - [TaskStatusList](#.TaskStatusList)
    - [ToolFund](#.ToolFund)
  
  
  
    - [TaskService](#.TaskService)
  

- [task_assignment.proto](#task_assignment.proto)
    - [TaskAssignment](#.TaskAssignment)
    - [TaskAssignmentList](#.TaskAssignmentList)
  
  
  
    - [TaskAssignmentService](#.TaskAssignmentService)
  

- [task_event.proto](#task_event.proto)
    - [TaskEvent](#.TaskEvent)
    - [TaskEventList](#.TaskEventList)
  
  
  
    - [TaskEventService](#.TaskEventService)


- [team.proto](#team.proto)
    - [Team](#.Team)
    - [TeamList](#.TeamList)
  
  
  
    - [TeamEventService](#.TeamEventService)
  

- [timeoff_request.proto](#timeoff_request.proto)
    - [PTO](#.PTO)
    - [TimeoffRequest](#.TimeoffRequest)
    - [TimeoffRequestList](#.TimeoffRequestList)
  
  
  
    - [TimeoffRequestService](#.TimeoffRequestService)
  

- [timesheet_classcode.proto](#timesheet_classcode.proto)
    - [TimesheetClassCode](#.TimesheetClassCode)
    - [TimesheetClassCodeList](#.TimesheetClassCodeList)
  
  
  
    - [TimesheetClassCodeService](#.TimesheetClassCodeService)
  

- [timesheet_department.proto](#timesheet_department.proto)
    - [TimesheetDepartment](#.TimesheetDepartment)
    - [TimesheetDepartmentList](#.TimesheetDepartmentList)
  
  
  
    - [TimesheetDepartmentService](#.TimesheetDepartmentService)
  

- [timesheet_line.proto](#timesheet_line.proto)
    - [SubmitApproveReq](#.SubmitApproveReq)
    - [Timesheet](#.Timesheet)
    - [Timesheet.DatesEntry](#.Timesheet.DatesEntry)
    - [TimesheetDay](#.TimesheetDay)
    - [TimesheetLine](#.TimesheetLine)
    - [TimesheetLineList](#.TimesheetLineList)
    - [TimesheetReq](#.TimesheetReq)
  
  
  
    - [TimesheetLineService](#.TimesheetLineService)
  

- [transaction.proto](#transaction.proto)
    - [RecordPageReq](#.RecordPageReq)
    - [Transaction](#.Transaction)
    - [TransactionList](#.TransactionList)
    - [TxnDepartment](#.TxnDepartment)
  
  
  
    - [TransactionService](#.TransactionService)
  

- [transaction_account.proto](#transaction_account.proto)
    - [TransactionAccount](#.TransactionAccount)
    - [TransactionAccountList](#.TransactionAccountList)
  
  
  
    - [TransactionAccountService](#.TransactionAccountService)
  

- [transaction_activity.proto](#transaction_activity.proto)
    - [TransactionActivity](#.TransactionActivity)
    - [TransactionActivityList](#.TransactionActivityList)
  
  
  
    - [TransactionActivityService](#.TransactionActivityService)
  

- [transaction_document.proto](#transaction_document.proto)
    - [TransactionDocument](#.TransactionDocument)
    - [TransactionDocumentList](#.TransactionDocumentList)
  
  
  
    - [TransactionDocumentService](#.TransactionDocumentService)
  

- [transaction_status.proto](#transaction_status.proto)
    - [TransactionStatus](#.TransactionStatus)
    - [TransactionStatusList](#.TransactionStatusList)
  
  
  
    - [TransactionStatusService](#.TransactionStatusService)
  

- [user.proto](#user.proto)
    - [CardData](#.CardData)
    - [CardDataList](#.CardDataList)
    - [User](#.User)
    - [UserList](#.UserList)
  
  
  
    - [UserService](#.UserService)
  

- [user_group_link.proto](#user_group_link.proto)
    - [UserGroupLink](#.UserGroupLink)
    - [UserGroupLinkList](#.UserGroupLinkList)
  
  
  
    - [UserGroupLinkService](#.UserGroupLinkService)
  

- [vendor.proto](#vendor.proto)
    - [Vendor](#.Vendor)
    - [VendorList](#.VendorList)
  
  
  
    - [VendorService](#.VendorService)
  

- [vendor_order.proto](#vendor_order.proto)
    - [VendorOrder](#.VendorOrder)
    - [VendorOrderList](#.VendorOrderList)
  
  
  
    - [VendorOrderService](#.VendorOrderService)
  

- [Scalar Value Types](#scalar-value-types)



<a name="activity_log.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## activity_log.proto



<a name=".ActivityLog"></a>

### ActivityLog



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;activity_id&#34; |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34; |
| activity_name | [string](#string) |  | database name:&#34;activity_name&#34; |
| activity_date | [string](#string) |  | database name:&#34;activity_date&#34;  |
| property_id | [int32](#int32) |  | database name:&#34;property_id&#34;  |
| contract_id | [int32](#int32) |  | database name:&#34;contract_id&#34;  |
| geolocation_lat | [double](#double) |  | database name:&#34;geolocation_lat&#34;  |
| geolocation_lng | [double](#double) |  | database name:&#34;geolocation_lng&#34;  |
| customer_id | [int32](#int32) |  | database name:&#34;customer_id&#34;  |
| task_id | [int32](#int32) |  | database name:&#34;task_id&#34;  |
| timesheet_line_id | [int32](#int32) |  | database name:&#34;timesheet_line_id&#34;  |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |
| date_range | [string](#string) | repeated | date_target:&#34;activity_date&#34; |
| date_target | [string](#string) |  |  |
| with_user | [bool](#bool) |  |  |
| user | [User](#User) |  | foreign_key:&#34;user_id&#34; foreign_table:&#34;userz&#34; local_name:&#34;user_id&#34; |






<a name=".ActivityLogList"></a>

### ActivityLogList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [ActivityLog](#ActivityLog) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".ActivityLogService"></a>

### ActivityLogService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.ActivityLog](#ActivityLog) | [.ActivityLog](#ActivityLog) |  |
| Get | [.ActivityLog](#ActivityLog) | [.ActivityLog](#ActivityLog) |  |
| BatchGet | [.ActivityLog](#ActivityLog) | [.ActivityLogList](#ActivityLogList) |  |
| List | [.ActivityLog](#ActivityLog) | [.ActivityLog](#ActivityLog) stream |  |
| Update | [.ActivityLog](#ActivityLog) | [.ActivityLog](#ActivityLog) |  |
| Delete | [.ActivityLog](#ActivityLog) | [.ActivityLog](#ActivityLog) |  |

 



<a name="api_key.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## api_key.proto



<a name=".ApiKey"></a>

### ApiKey



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;api_key_id&#34; |
| text_id | [string](#string) |  | database name:&#34;api_key_text_id&#34;  |
| api_key | [string](#string) |  | database name:&#34;api_key&#34;  |
| api_endpoint | [string](#string) |  | database name:&#34;api_endpoint&#34;  |
| api_description | [string](#string) |  | database name:&#34;api_description&#34;  |
| api_user | [int32](#int32) |  | database name:&#34;api_user&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".ApiKeyList"></a>

### ApiKeyList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [ApiKey](#ApiKey) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".ApiKeyService"></a>

### ApiKeyService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.ApiKey](#ApiKey) | [.ApiKey](#ApiKey) |  |
| Get | [.ApiKey](#ApiKey) | [.ApiKey](#ApiKey) |  |
| BatchGet | [.ApiKey](#ApiKey) | [.ApiKeyList](#ApiKeyList) |  |
| List | [.ApiKey](#ApiKey) | [.ApiKey](#ApiKey) stream |  |
| Update | [.ApiKey](#ApiKey) | [.ApiKey](#ApiKey) |  |
| Delete | [.ApiKey](#ApiKey) | [.ApiKey](#ApiKey) |  |

 



<a name="auth.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## auth.proto



<a name=".AuthData"></a>

### AuthData



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| username | [string](#string) |  |  |
| password | [string](#string) |  |  |






<a name=".Token"></a>

### Token



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| as_string | [string](#string) |  |  |





 

 

 


<a name=".AuthService"></a>

### AuthService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetToken | [.AuthData](#AuthData) | [.Token](#Token) |  |

 



<a name="call_association.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## call_association.proto



<a name=".CallAssociation"></a>

### CallAssociation



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;call_association_id&#34; |
| customer_id | [int32](#int32) |  | database name:&#34;customer_id&#34; |
| phone_call_id | [int32](#int32) |  | database name:&#34;phone_call_id&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".CallAssociationList"></a>

### CallAssociationList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [CallAssociation](#CallAssociation) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".CallAssociationService"></a>

### CallAssociationService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.CallAssociation](#CallAssociation) | [.CallAssociation](#CallAssociation) |  |
| Get | [.CallAssociation](#CallAssociation) | [.CallAssociation](#CallAssociation) |  |
| BatchGet | [.CallAssociation](#CallAssociation) | [.CallAssociationList](#CallAssociationList) |  |
| List | [.CallAssociation](#CallAssociation) | [.CallAssociation](#CallAssociation) stream |  |
| Update | [.CallAssociation](#CallAssociation) | [.CallAssociation](#CallAssociation) |  |
| Delete | [.CallAssociation](#CallAssociation) | [.CallAssociation](#CallAssociation) |  |

 



<a name="common.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## common.proto



<a name=".DateRange"></a>

### DateRange



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| start | [string](#string) |  |  |
| end | [string](#string) |  |  |
| field | [string](#string) |  |  |






<a name=".Double"></a>

### Double



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| value | [double](#double) |  |  |






<a name=".Empty"></a>

### Empty







<a name=".Int32"></a>

### Int32



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| value | [int32](#int32) |  |  |






<a name=".Int32List"></a>

### Int32List



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| values | [int32](#int32) | repeated |  |






<a name=".String"></a>

### String



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| value | [string](#string) |  |  |






<a name=".StringList"></a>

### StringList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| values | [string](#string) | repeated |  |





 

 

 

 



<a name="contract.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## contract.proto



<a name=".Contract"></a>

### Contract



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;contract_id&#34; |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34;  |
| number | [string](#string) |  | database name:&#34;contract_number&#34;  |
| properties | [string](#string) |  | database name:&#34;contract_properties&#34;  |
| date_created | [string](#string) |  | database name:&#34;contract_date_created&#34;  |
| date_started | [string](#string) |  | database name:&#34;contract_date_started&#34;  |
| date_ended | [string](#string) |  | database name:&#34;contract_date_ended&#34;  |
| frequency | [int32](#int32) |  | database name:&#34;contract_frequency&#34;  |
| group_billing | [int32](#int32) |  | database name:&#34;contract_group_billing&#34; |
| payment_status | [string](#string) |  | database name:&#34;contract_paymentStatus&#34;  |
| payment_terms | [string](#string) |  | database name:&#34;contract_paymentTerms&#34;  |
| notes | [string](#string) |  | database name:&#34;contract_notes&#34;  |
| payment_type | [string](#string) |  | database name:&#34;contract_payment_type&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;contract_isActive&#34; |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |
| date_target | [string](#string) | repeated |  |
| date_range | [string](#string) | repeated | date_target:&#34;date_started&#34; |






<a name=".ContractList"></a>

### ContractList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Contract](#Contract) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".ContractService"></a>

### ContractService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Contract](#Contract) | [.Contract](#Contract) |  |
| Get | [.Contract](#Contract) | [.Contract](#Contract) |  |
| BatchGet | [.Contract](#Contract) | [.ContractList](#ContractList) |  |
| List | [.Contract](#Contract) | [.Contract](#Contract) stream |  |
| Update | [.Contract](#Contract) | [.Contract](#Contract) |  |
| Delete | [.Contract](#Contract) | [.Contract](#Contract) |  |

 



<a name="contract_frequency.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## contract_frequency.proto



<a name=".ContractFrequency"></a>

### ContractFrequency



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;frequency_id&#34; |
| name | [string](#string) |  | database name:&#34;frequency_name&#34;  |
| interval | [int32](#int32) |  | database name:&#34;frequency_interval&#34;  |
| maintenance_count | [int32](#int32) |  | database name:&#34;maintenance_count&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".ContractFrequencyList"></a>

### ContractFrequencyList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [ContractFrequency](#ContractFrequency) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".ContractFrequencyService"></a>

### ContractFrequencyService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.ContractFrequency](#ContractFrequency) | [.ContractFrequency](#ContractFrequency) |  |
| Get | [.ContractFrequency](#ContractFrequency) | [.ContractFrequency](#ContractFrequency) |  |
| BatchGet | [.ContractFrequency](#ContractFrequency) | [.ContractFrequencyList](#ContractFrequencyList) |  |
| List | [.ContractFrequency](#ContractFrequency) | [.ContractFrequency](#ContractFrequency) stream |  |
| Update | [.ContractFrequency](#ContractFrequency) | [.ContractFrequency](#ContractFrequency) |  |
| Delete | [.ContractFrequency](#ContractFrequency) | [.ContractFrequency](#ContractFrequency) |  |

 



<a name="default_view.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## default_view.proto



<a name=".DefaultView"></a>

### DefaultView



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34;  |
| view_type | [string](#string) |  | database name:&#34;view_type&#34;  |
| default_view | [string](#string) |  | database name:&#34;default_view&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".DefaultViewList"></a>

### DefaultViewList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [DefaultView](#DefaultView) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".DefaultViewService"></a>

### DefaultViewService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.DefaultView](#DefaultView) | [.DefaultView](#DefaultView) |  |
| Get | [.DefaultView](#DefaultView) | [.DefaultView](#DefaultView) |  |
| BatchGet | [.DefaultView](#DefaultView) | [.DefaultViewList](#DefaultViewList) |  |
| List | [.DefaultView](#DefaultView) | [.DefaultView](#DefaultView) stream |  |
| Update | [.DefaultView](#DefaultView) | [.DefaultView](#DefaultView) |  |
| Delete | [.DefaultView](#DefaultView) | [.DefaultView](#DefaultView) |  |

 



<a name="document.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## document.proto



<a name=".Document"></a>

### Document



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;document_id&#34; |
| invoice_id | [int32](#int32) |  | database name:&#34;invoice_id&#34; |
| property_id | [int32](#int32) |  | database name:&#34;property_id&#34;  |
| contract_id | [int32](#int32) |  | database name:&#34;contract_id&#34;  |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34;  |
| task_id | [int32](#int32) |  | database name:&#34;task_id&#34;  |
| file_id | [int32](#int32) |  | database name:&#34;file_id&#34;  |
| filename | [string](#string) |  | database name:&#34;document_filename&#34;  |
| date_created | [string](#string) |  | database name:&#34;document_date_created&#34; |
| description | [string](#string) |  | database name:&#34;document_description&#34;  |
| type | [int32](#int32) |  | database name:&#34;document_type&#34; |
| version | [int32](#int32) |  | database name:&#34;document_version&#34; |
| invoice | [int32](#int32) |  | database name:&#34;invoice&#34;  |
| quote | [int32](#int32) |  | database name:&#34;quote&#34;  |
| maintenance | [int32](#int32) |  | database name:&#34;maintenance&#34;  |
| other | [int32](#int32) |  | database name:&#34;other&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |






<a name=".DocumentList"></a>

### DocumentList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Document](#Document) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".DocumentService"></a>

### DocumentService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Document](#Document) | [.Document](#Document) |  |
| Get | [.Document](#Document) | [.Document](#Document) |  |
| BatchGet | [.Document](#Document) | [.DocumentList](#DocumentList) |  |
| List | [.Document](#Document) | [.Document](#Document) stream |  |
| Update | [.Document](#Document) | [.Document](#Document) |  |
| Delete | [.Document](#Document) | [.Document](#Document) |  |

 



<a name="email.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## email.proto



<a name=".Email"></a>

### Email



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| recipient | [string](#string) |  |  |
| from_key | [string](#string) |  |  |
| body | [string](#string) |  |  |
| sent | [int32](#int32) |  |  |
| error | [string](#string) |  |  |





 

 

 


<a name=".EmailService"></a>

### EmailService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Email](#Email) | [.Email](#Email) |  |

 



<a name="employee_function.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## employee_function.proto



<a name=".EmployeeFunction"></a>

### EmployeeFunction



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;depart_id&#34; |
| name | [string](#string) |  | database name:&#34;depart_name&#34; |
| color | [string](#string) |  | database name:&#34;depart_color&#34; |
| status | [int32](#int32) |  | database name:&#34;depart_status&#34; |
| isdeleted | [int32](#int32) |  | database name:&#34;depart_isdeleted&#34; |
| addeddate | [string](#string) |  | database name:&#34;depart_addeddate&#34; |
| modifydate | [string](#string) |  | database name:&#34;depart_modifydate&#34;  |
| addeduserid | [int32](#int32) |  | database name:&#34;depart_addeduserid&#34; |
| modifyuserid | [int32](#int32) |  | database name:&#34;depart_modifyuserid&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".EmployeeFunctionList"></a>

### EmployeeFunctionList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [EmployeeFunction](#EmployeeFunction) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".EmployeeFunctionService"></a>

### EmployeeFunctionService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.EmployeeFunction](#EmployeeFunction) | [.EmployeeFunction](#EmployeeFunction) |  |
| Get | [.EmployeeFunction](#EmployeeFunction) | [.EmployeeFunction](#EmployeeFunction) |  |
| BatchGet | [.EmployeeFunction](#EmployeeFunction) | [.EmployeeFunctionList](#EmployeeFunctionList) |  |
| List | [.EmployeeFunction](#EmployeeFunction) | [.EmployeeFunction](#EmployeeFunction) stream |  |
| Update | [.EmployeeFunction](#EmployeeFunction) | [.EmployeeFunction](#EmployeeFunction) |  |
| Delete | [.EmployeeFunction](#EmployeeFunction) | [.EmployeeFunction](#EmployeeFunction) |  |

 



<a name="event.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## event.proto



<a name=".CalendarData"></a>

### CalendarData



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| dates | [CalendarData.DatesEntry](#CalendarData.DatesEntry) | repeated |  |
| customers | [CalendarData.CustomersEntry](#CalendarData.CustomersEntry) | repeated |  |
| zip_codes | [CalendarData.ZipCodesEntry](#CalendarData.ZipCodesEntry) | repeated |  |






<a name=".CalendarData.CustomersEntry"></a>

### CalendarData.CustomersEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [int32](#int32) |  |  |
| value | [string](#string) |  |  |






<a name=".CalendarData.DatesEntry"></a>

### CalendarData.DatesEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [CalendarDay](#CalendarDay) |  |  |






<a name=".CalendarData.ZipCodesEntry"></a>

### CalendarData.ZipCodesEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [string](#string) |  |  |






<a name=".CalendarDay"></a>

### CalendarDay



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| service_calls | [Event](#Event) | repeated |  |
| completed_service_calls | [Event](#Event) | repeated |  |
| reminders | [Event](#Event) | repeated |  |
| timeoff_requests | [TimeoffRequest](#TimeoffRequest) | repeated |  |






<a name=".Event"></a>

### Event



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| name | [string](#string) |  | database name:&#34;name&#34; |
| description | [string](#string) |  | database name:&#34;description&#34;  |
| date_started | [string](#string) |  | database name:&#34;date_started&#34;  |
| date_ended | [string](#string) |  | database name:&#34;date_ended&#34;  |
| time_started | [string](#string) |  | database name:&#34;time_started&#34;  |
| time_ended | [string](#string) |  | database name:&#34;time_ended&#34;  |
| is_all_day | [int32](#int32) |  | database name:&#34;is_all_day&#34; |
| repeat_type | [int32](#int32) |  | database name:&#34;repeat_type&#34; |
| color | [string](#string) |  | database name:&#34;color&#34; |
| date_updated | [string](#string) |  | database name:&#34;date_updated&#34; |
| date_created | [string](#string) |  | database name:&#34;date_created&#34; |
| property_id | [int32](#int32) |  | database name:&#34;property_id&#34; |
| contract_id | [int32](#int32) |  | database name:&#34;contract_id&#34;  |
| contract_number | [string](#string) |  | database name:&#34;contract_number&#34;  |
| log_job_number | [string](#string) |  | database name:&#34;log_jobNumber&#34;  |
| log_job_status | [string](#string) |  | database name:&#34;log_jobStatus&#34;  |
| log_po | [string](#string) |  | database name:&#34;log_PO&#34;  |
| log_notes | [string](#string) |  | database name:&#34;log_notes&#34;  |
| log_technician_assigned | [string](#string) |  | database name:&#34;log_technicianAssigned&#34;  |
| log_date_completed | [string](#string) |  | database name:&#34;log_dateCompleted&#34;  |
| log_materials_used | [string](#string) |  | database name:&#34;log_materialsUsed&#34;  |
| log_service_rendered | [string](#string) |  | database name:&#34;log_serviceRendered&#34;  |
| log_tech_notes | [string](#string) |  | database name:&#34;log_techNotes&#34;  |
| log_billing_date | [string](#string) |  | database name:&#34;log_billingDate&#34;  |
| log_amount_charged | [string](#string) |  | database name:&#34;log_amountCharged&#34;  |
| log_payment_type | [string](#string) |  | database name:&#34;log_payment_type&#34;  |
| log_payment_status | [string](#string) |  | database name:&#34;log_paymentStatus&#34;  |
| log_time_in | [string](#string) |  | database name:&#34;log_timeIn&#34;  |
| log_time_out | [string](#string) |  | database name:&#34;log_timeOut&#34;  |
| log_type | [string](#string) |  | database name:&#34;log_type&#34;  |
| log_contract_notes | [string](#string) |  | database name:&#34;log_contractNotes&#34;  |
| invoice_service_item | [string](#string) |  | database name:&#34;invoice_serviceItem&#34;  |
| tstat_type | [string](#string) |  | database name:&#34;tstat_type&#34;  |
| tstat_brand | [string](#string) |  | database name:&#34;tstat_brand&#34;  |
| compressor_amps | [string](#string) |  | database name:&#34;compressor_amps&#34;  |
| condensing_fan_amps | [string](#string) |  | database name:&#34;condensing_fan_amps&#34;  |
| suction_pressure | [string](#string) |  | database name:&#34;suction_pressure&#34;  |
| head_pressure | [string](#string) |  | database name:&#34;head_pressure&#34;  |
| return_temperature | [string](#string) |  | database name:&#34;return_temperature&#34;  |
| supply_temperature | [string](#string) |  | database name:&#34;supply_temperature&#34;  |
| subcool | [string](#string) |  | database name:&#34;subcool&#34;  |
| superheat | [string](#string) |  | database name:&#34;superheat&#34;  |
| notes | [string](#string) |  | database name:&#34;notes&#34;  |
| services | [string](#string) |  | database name:&#34;services&#34;  |
| servicesperformedrow1 | [string](#string) |  | database name:&#34;servicesperformedrow1&#34;  |
| totalamountrow1 | [string](#string) |  | database name:&#34;totalamountrow1&#34;  |
| servicesperformedrow2 | [string](#string) |  | database name:&#34;servicesperformedrow2&#34;  |
| totalamountrow2 | [string](#string) |  | database name:&#34;totalamountrow2&#34;  |
| servicesperformedrow3 | [string](#string) |  | database name:&#34;servicesperformedrow3&#34;  |
| totalamountrow3 | [string](#string) |  | database name:&#34;totalamountrow3&#34;  |
| servicesperformedrow4 | [string](#string) |  | database name:&#34;servicesperformedrow4&#34;  |
| totalamountrow4 | [string](#string) |  | database name:&#34;totalamountrow4&#34;  |
| discount | [string](#string) |  | database name:&#34;discount&#34;  |
| discountcost | [string](#string) |  | database name:&#34;discountcost&#34;  |
| log_notification | [string](#string) |  | database name:&#34;log_notification&#34;  |
| diagnostic_quoted | [int32](#int32) |  | database name:&#34;diagnosticQuoted&#34; |
| amount_quoted | [string](#string) |  | database name:&#34;amountQuoted&#34;  |
| property_billing | [int32](#int32) |  | database name:&#34;propertyBilling&#34; |
| is_callback | [int32](#int32) |  | database name:&#34;isCallback&#34;  |
| log_version | [int32](#int32) |  | database name:&#34;log_version&#34; |
| job_type_id | [int32](#int32) |  | database name:&#34;job_type_id&#34;  |
| job_subtype_id | [int32](#int32) |  | database name:&#34;job_subtype_id&#34;  |
| callback_original_id | [int32](#int32) |  | database name:&#34;callback_original_id&#34;  |
| callback_disposition | [int32](#int32) |  | database name:&#34;callback_disposition&#34;  |
| callback_comments | [string](#string) |  | database name:&#34;callback_comments&#34;  |
| callback_technician | [int32](#int32) |  | database name:&#34;callback_technician&#34;  |
| callback_approval_timestamp | [string](#string) |  | database name:&#34;callback_approval_timestamp&#34;  |
| callback_comment_by | [int32](#int32) |  | database name:&#34;callback_comment_by&#34;  |
| document_id | [int32](#int32) |  | database name:&#34;document_id&#34;  |
| material_used | [string](#string) |  | database name:&#34;material_used&#34;  |
| material_total | [double](#double) |  | database name:&#34;material_total&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;isActive&#34;  |
| parent_id | [int32](#int32) |  | database name:&#34;parent_id&#34;  |
| is_lmpc | [int32](#int32) |  | database name:&#34;isLmpc&#34; |
| high_priority | [int32](#int32) |  | database name:&#34;highPriority&#34; |
| is_residential | [int32](#int32) |  | database name:&#34;isResidential&#34; |
| job_type | [string](#string) |  |  |
| job_subtype | [string](#string) |  |  |
| customer | [User](#User) |  | local_name:&#34;id&#34; foreign_key:&#34;id&#34; foreign_table:&#34;servicable2&#34; |
| property | [Property](#Property) |  | foreign_key:&#34;property_id&#34; foreign_table:&#34;properties&#34; local_name:&#34;property_id&#34; |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |
| date_target | [string](#string) | repeated |  |
| date_range | [string](#string) | repeated | date_target:&#34;date_started&#34; |
| count_only | [bool](#bool) |  |  |
| quote_data | [Quotable](#Quotable) | repeated |  |
| department_id | [int32](#int32) |  | database name:&#34;department_id&#34;  |






<a name=".EventList"></a>

### EventList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Event](#Event) | repeated |  |
| total_count | [int32](#int32) |  |  |






<a name=".Quotable"></a>

### Quotable



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34;  |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| quote_used_id | [int32](#int32) |  | database name:&#34;quote_used_id&#34;  |
| services_rendered_id | [int32](#int32) |  | database name:&#34;services_rendered_id&#34;  |
| quote_line_id | [int32](#int32) |  | database name:&#34;quote_line_id&#34;  |
| description | [string](#string) |  | database name:&#34;description&#34;  |
| quoted_price | [double](#double) |  | database name:&#34;quoted_price&#34;  |
| quantity | [double](#double) |  | database name:&#34;quantity&#34;  |
| is_billable | [bool](#bool) |  | database name:&#34;is_billable&#34;  |
| is_lmpc | [bool](#bool) |  | database name:&#34;is_lmpc&#34;  |
| is_flatrate | [bool](#bool) |  | database name:&#34;is_flatrate&#34;  |
| is_complex | [bool](#bool) |  | database name:&#34;is_complex&#34;  |
| is_active | [bool](#bool) |  | database name:&#34;is_active&#34;  |
| field_mask | [string](#string) | repeated |  |






<a name=".QuotableList"></a>

### QuotableList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [Quotable](#Quotable) | repeated |  |





 

 

 


<a name=".EventService"></a>

### EventService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Event](#Event) | [.Event](#Event) |  |
| Get | [.Event](#Event) | [.Event](#Event) |  |
| BatchGet | [.Event](#Event) | [.EventList](#EventList) |  |
| List | [.Event](#Event) | [.Event](#Event) stream |  |
| Update | [.Event](#Event) | [.Event](#Event) |  |
| Delete | [.Event](#Event) | [.Event](#Event) |  |
| GetCalendarData | [.Event](#Event) | [.CalendarData](#CalendarData) |  |
| WriteQuote | [.Quotable](#Quotable) | [.Quotable](#Quotable) |  |
| ReadQuotes | [.Quotable](#Quotable) | [.QuotableList](#QuotableList) |  |
| GetProjectTasks | [.ProjectTask](#ProjectTask) | [.ProjectTaskList](#ProjectTaskList) |  |

 



<a name="event_assignment.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## event_assignment.proto



<a name=".EventAssignment"></a>

### EventAssignment



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;event_assignment_id&#34; |
| user_id | [int32](#int32) |  | database name:&#34;technician_user_id&#34; |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34; |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".EventAssignmentList"></a>

### EventAssignmentList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [EventAssignment](#EventAssignment) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".EventAssignmentService"></a>

### EventAssignmentService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.EventAssignment](#EventAssignment) | [.EventAssignment](#EventAssignment) |  |
| Get | [.EventAssignment](#EventAssignment) | [.EventAssignment](#EventAssignment) |  |
| BatchGet | [.EventAssignment](#EventAssignment) | [.EventAssignmentList](#EventAssignmentList) |  |
| List | [.EventAssignment](#EventAssignment) | [.EventAssignment](#EventAssignment) stream |  |
| Update | [.EventAssignment](#EventAssignment) | [.EventAssignment](#EventAssignment) |  |
| Delete | [.EventAssignment](#EventAssignment) | [.EventAssignment](#EventAssignment) |  |

 



<a name="event_deletion.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## event_deletion.proto



<a name=".EventDeletion"></a>

### EventDeletion



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;event_deletion_id&#34; |
| deleted_event_id | [int32](#int32) |  | database name:&#34;deleted_event_id&#34; |
| activity_id | [int32](#int32) |  | database name:&#34;activity_id&#34;  |
| reason | [string](#string) |  | database name:&#34;reason&#34;  |
| affirmation | [int32](#int32) |  | database name:&#34;affirmation&#34;  |
| is_restored | [int32](#int32) |  | database name:&#34;isRestored&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".EventDeletionList"></a>

### EventDeletionList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [EventDeletion](#EventDeletion) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".EventDeletionService"></a>

### EventDeletionService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.EventDeletion](#EventDeletion) | [.EventDeletion](#EventDeletion) |  |
| Get | [.EventDeletion](#EventDeletion) | [.EventDeletion](#EventDeletion) |  |
| BatchGet | [.EventDeletion](#EventDeletion) | [.EventDeletionList](#EventDeletionList) |  |
| List | [.EventDeletion](#EventDeletion) | [.EventDeletion](#EventDeletion) stream |  |
| Update | [.EventDeletion](#EventDeletion) | [.EventDeletion](#EventDeletion) |  |
| Delete | [.EventDeletion](#EventDeletion) | [.EventDeletion](#EventDeletion) |  |

 



<a name="file.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## file.proto



<a name=".File"></a>

### File



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| name | [string](#string) |  | database name:&#34;name&#34; |
| bucket | [string](#string) |  | database name:&#34;bucket&#34; |
| mime_type | [string](#string) |  | database name:&#34;mime_type&#34;  |
| create_time | [string](#string) |  | database name:&#34;create_time&#34;  |
| owner_id | [int32](#int32) |  | database name:&#34;owner_id&#34;  |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| geolocation_lat | [double](#double) |  | database name:&#34;geolocation_lat&#34;  |
| geolocation_lng | [double](#double) |  | database name:&#34;geolocation_lng&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".FileList"></a>

### FileList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [File](#File) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".FileService"></a>

### FileService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.File](#File) | [.File](#File) |  |
| Get | [.File](#File) | [.File](#File) |  |
| BatchGet | [.File](#File) | [.FileList](#FileList) |  |
| List | [.File](#File) | [.File](#File) stream |  |
| Update | [.File](#File) | [.File](#File) |  |
| Delete | [.File](#File) | [.File](#File) |  |

 



<a name="first_call.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## first_call.proto



<a name=".FirstCall"></a>

### FirstCall



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| date_created | [string](#string) |  | database name:&#34;date_created&#34;  |
| json | [string](#string) |  | database name:&#34;json&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".FirstCallList"></a>

### FirstCallList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [FirstCall](#FirstCall) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".FirstCallService"></a>

### FirstCallService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.FirstCall](#FirstCall) | [.FirstCall](#FirstCall) |  |
| Get | [.FirstCall](#FirstCall) | [.FirstCall](#FirstCall) |  |
| BatchGet | [.FirstCall](#FirstCall) | [.FirstCallList](#FirstCallList) |  |
| List | [.FirstCall](#FirstCall) | [.FirstCall](#FirstCall) stream |  |
| Update | [.FirstCall](#FirstCall) | [.FirstCall](#FirstCall) |  |
| Delete | [.FirstCall](#FirstCall) | [.FirstCall](#FirstCall) |  |

 



<a name="group.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## group.proto



<a name=".Group"></a>

### Group



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;group_id&#34; |
| name | [string](#string) |  | database name:&#34;group_name&#34; |
| field_mask | [string](#string) | repeated |  |






<a name=".GroupList"></a>

### GroupList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Group](#Group) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".GroupService"></a>

### GroupService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Group](#Group) | [.Group](#Group) |  |
| Get | [.Group](#Group) | [.Group](#Group) |  |
| BatchGet | [.Group](#Group) | [.GroupList](#GroupList) |  |
| List | [.Group](#Group) | [.Group](#Group) stream |  |
| Update | [.Group](#Group) | [.Group](#Group) |  |
| Delete | [.Group](#Group) | [.Group](#Group) |  |

 



<a name="internal_document.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## internal_document.proto



<a name=".DocumentKey"></a>

### DocumentKey



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34;  |
| name | [string](#string) |  | database name:&#34;name&#34; |
| color | [string](#string) |  | database name:&#34;color&#34; |
| is_active | [bool](#bool) |  | database name:&#34;isActive&#34; |
| date_created | [string](#string) |  | database name:&#34;dateCreated&#34; |
| field_mask | [string](#string) | repeated |  |






<a name=".DocumentKeyList"></a>

### DocumentKeyList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [DocumentKey](#DocumentKey) | repeated |  |






<a name=".InternalDocument"></a>

### InternalDocument



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;idocument_id&#34; |
| doc_user_id | [int32](#int32) |  | database name:&#34;doc_user_id&#34;  |
| filename | [string](#string) |  | database name:&#34;idocument_filename&#34; |
| date_created | [string](#string) |  | database name:&#34;idocument_date_created&#34; |
| description | [string](#string) |  | database name:&#34;idocument_description&#34;  |
| tag | [int32](#int32) |  | database name:&#34;idocument_tag&#34;  |
| file_id | [int32](#int32) |  | database name:&#34;file_id&#34; |
| date_modified | [string](#string) |  | database name:&#34;idocument_date_modified&#34;  |
| tag_data | [DocumentKey](#DocumentKey) |  | foreign_key:&#34;id&#34; foreign_table:&#34;document_key&#34; local_name:&#34;idocument_tag&#34; |
| file | [File](#File) |  | foreign_key:&#34;id&#34; foreign_table:&#34;files&#34; local_name:&#34;file_id&#34; |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |






<a name=".InternalDocumentList"></a>

### InternalDocumentList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [InternalDocument](#InternalDocument) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".InternalDocumentService"></a>

### InternalDocumentService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.InternalDocument](#InternalDocument) | [.InternalDocument](#InternalDocument) |  |
| Get | [.InternalDocument](#InternalDocument) | [.InternalDocument](#InternalDocument) |  |
| BatchGet | [.InternalDocument](#InternalDocument) | [.InternalDocumentList](#InternalDocumentList) |  |
| List | [.InternalDocument](#InternalDocument) | [.InternalDocument](#InternalDocument) stream |  |
| Update | [.InternalDocument](#InternalDocument) | [.InternalDocument](#InternalDocument) |  |
| Delete | [.InternalDocument](#InternalDocument) | [.InternalDocument](#InternalDocument) |  |
| GetDocumentKeys | [.DocumentKey](#DocumentKey) | [.DocumentKeyList](#DocumentKeyList) |  |
| WriteDocumentKey | [.DocumentKey](#DocumentKey) | [.DocumentKey](#DocumentKey) |  |
| DeleteDocumentKey | [.DocumentKey](#DocumentKey) | [.Empty](#Empty) |  |

 



<a name="invoice.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## invoice.proto



<a name=".Invoice"></a>

### Invoice



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;invoice_id&#34; |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| contract_id | [int32](#int32) |  | database name:&#34;contract_id&#34; |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34; |
| property_id | [int32](#int32) |  | database name:&#34;property_id&#34;  |
| system_type | [string](#string) |  | database name:&#34;system_type&#34;  |
| system_type_2 | [string](#string) |  | database name:&#34;system_type_2&#34;  |
| compressor_amps | [string](#string) |  | database name:&#34;compressor_amps&#34;  |
| model | [string](#string) |  | database name:&#34;model&#34;  |
| brand | [string](#string) |  | database name:&#34;brand&#34;  |
| condensing_fan_amps | [string](#string) |  | database name:&#34;condensing_fan_amps&#34;  |
| serial | [string](#string) |  | database name:&#34;serial&#34;  |
| start_date | [string](#string) |  | database name:&#34;start_date&#34;  |
| suction_pressure | [string](#string) |  | database name:&#34;suction_pressure&#34;  |
| head_pressure | [string](#string) |  | database name:&#34;head_pressure&#34;  |
| model_2 | [string](#string) |  | database name:&#34;model_2&#34;  |
| brand_2 | [string](#string) |  | database name:&#34;brand_2&#34;  |
| return_temperature | [string](#string) |  | database name:&#34;return_temperature&#34;  |
| serial_2 | [string](#string) |  | database name:&#34;serial_2&#34;  |
| start_date_2 | [string](#string) |  | database name:&#34;start_date_2&#34;  |
| supply_temperature | [string](#string) |  | database name:&#34;supply_temperature&#34;  |
| tstat_type | [string](#string) |  | database name:&#34;tstat_type&#34;  |
| tstat_brand | [string](#string) |  | database name:&#34;tstat_brand&#34;  |
| subcool | [string](#string) |  | database name:&#34;subcool&#34;  |
| filter_sizes | [string](#string) |  | database name:&#34;filter_sizes&#34;  |
| superheat | [string](#string) |  | database name:&#34;superheat&#34;  |
| notes | [string](#string) |  | database name:&#34;notes&#34;  |
| properties | [string](#string) |  | database name:&#34;properties&#34;  |
| terms | [string](#string) |  | database name:&#34;terms&#34;  |
| servicesperformedrow1 | [string](#string) |  | database name:&#34;servicesperformedrow1&#34;  |
| totalamountrow1 | [string](#string) |  | database name:&#34;totalamountrow1&#34;  |
| servicesperformedrow2 | [string](#string) |  | database name:&#34;servicesperformedrow2&#34;  |
| totalamountrow2 | [string](#string) |  | database name:&#34;totalamountrow2&#34;  |
| servicesperformedrow3 | [string](#string) |  | database name:&#34;servicesperformedrow3&#34;  |
| totalamountrow3 | [string](#string) |  | database name:&#34;totalamountrow3&#34;  |
| servicesperformedrow4 | [string](#string) |  | database name:&#34;servicesperformedrow4&#34;  |
| totalamountrow4 | [string](#string) |  | database name:&#34;totalamountrow4&#34;  |
| discount | [string](#string) |  | database name:&#34;discount&#34;  |
| discountcost | [string](#string) |  | database name:&#34;discountcost&#34;  |
| totalamounttotal | [string](#string) |  | database name:&#34;totalamounttotal&#34;  |
| credit | [int32](#int32) |  | database name:&#34;credit&#34; |
| cash | [int32](#int32) |  | database name:&#34;cash&#34; |
| by_check | [int32](#int32) |  | database name:&#34;by_check&#34; |
| billing | [int32](#int32) |  | database name:&#34;billing&#34; |
| payment_yes | [int32](#int32) |  | database name:&#34;payment_yes&#34; |
| payment_no | [int32](#int32) |  | database name:&#34;payment_no&#34; |
| service_item | [string](#string) |  | database name:&#34;invoice_serviceItem&#34;  |
| log_payment_type | [string](#string) |  | database name:&#34;log_payment_type&#34;  |
| log_payment_status | [string](#string) |  | database name:&#34;log_paymentStatus&#34;  |
| property_billing | [int32](#int32) |  | database name:&#34;propertyBilling&#34; |
| material_used | [string](#string) |  | database name:&#34;material_used&#34;  |
| material_total | [string](#string) |  | database name:&#34;material_total&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".InvoiceList"></a>

### InvoiceList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Invoice](#Invoice) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".InvoiceService"></a>

### InvoiceService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Invoice](#Invoice) | [.Invoice](#Invoice) |  |
| Get | [.Invoice](#Invoice) | [.Invoice](#Invoice) |  |
| BatchGet | [.Invoice](#Invoice) | [.InvoiceList](#InvoiceList) |  |
| List | [.Invoice](#Invoice) | [.Invoice](#Invoice) stream |  |
| Update | [.Invoice](#Invoice) | [.Invoice](#Invoice) |  |
| Delete | [.Invoice](#Invoice) | [.Invoice](#Invoice) |  |

 



<a name="job_subtype.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## job_subtype.proto



<a name=".JobSubtype"></a>

### JobSubtype



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| name | [string](#string) |  | database name:&#34;name&#34; |
| class_code | [int32](#int32) |  | database name:&#34;class_code&#34;  |
| subtype_code | [string](#string) |  | @inject_tag database name:&#34;job_subtype_code&#34;  |






<a name=".JobSubtypeList"></a>

### JobSubtypeList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [JobSubtype](#JobSubtype) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".JobSubtypeService"></a>

### JobSubtypeService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Get | [.JobSubtype](#JobSubtype) | [.JobSubtype](#JobSubtype) |  |
| BatchGet | [.JobSubtype](#JobSubtype) | [.JobSubtypeList](#JobSubtypeList) |  |
| List | [.JobSubtype](#JobSubtype) | [.JobSubtype](#JobSubtype) stream |  |

 



<a name="job_type.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## job_type.proto



<a name=".JobType"></a>

### JobType



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| name | [string](#string) |  | database name:&#34;name&#34; |






<a name=".JobTypeList"></a>

### JobTypeList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [JobType](#JobType) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".JobTypeService"></a>

### JobTypeService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Get | [.JobType](#JobType) | [.JobType](#JobType) |  |
| BatchGet | [.JobType](#JobType) | [.JobTypeList](#JobTypeList) |  |
| List | [.JobType](#JobType) | [.JobType](#JobType) stream |  |

 



<a name="job_type_subtype.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## job_type_subtype.proto



<a name=".JobTypeSubtype"></a>

### JobTypeSubtype



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| job_type_id | [int32](#int32) |  | database name:&#34;job_type_id&#34; |
| job_subtype_id | [int32](#int32) |  | database name:&#34;job_subtype_id&#34; |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".JobTypeSubtypeList"></a>

### JobTypeSubtypeList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [JobTypeSubtype](#JobTypeSubtype) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".JobTypeSubtypeService"></a>

### JobTypeSubtypeService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.JobTypeSubtype](#JobTypeSubtype) | [.JobTypeSubtype](#JobTypeSubtype) |  |
| Get | [.JobTypeSubtype](#JobTypeSubtype) | [.JobTypeSubtype](#JobTypeSubtype) |  |
| BatchGet | [.JobTypeSubtype](#JobTypeSubtype) | [.JobTypeSubtypeList](#JobTypeSubtypeList) |  |
| List | [.JobTypeSubtype](#JobTypeSubtype) | [.JobTypeSubtype](#JobTypeSubtype) stream |  |
| Update | [.JobTypeSubtype](#JobTypeSubtype) | [.JobTypeSubtype](#JobTypeSubtype) |  |
| Delete | [.JobTypeSubtype](#JobTypeSubtype) | [.JobTypeSubtype](#JobTypeSubtype) |  |

 



<a name="kalosmaps.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## kalosmaps.proto



<a name=".Coordinates"></a>

### Coordinates



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| latitude | [double](#double) |  |  |
| longitude | [double](#double) |  |  |






<a name=".CoordinatesList"></a>

### CoordinatesList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [Coordinates](#Coordinates) | repeated |  |






<a name=".MatrixRequest"></a>

### MatrixRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| origins | [Coordinates](#Coordinates) | repeated |  |
| destination | [Coordinates](#Coordinates) |  |  |






<a name=".Place"></a>

### Place



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| street_number | [int32](#int32) |  |  |
| road_name | [string](#string) |  |  |
| city | [string](#string) |  |  |
| state | [string](#string) |  |  |
| country | [string](#string) |  |  |
| zip_code | [string](#string) |  |  |
| coords | [Coordinates](#Coordinates) |  |  |






<a name=".Places"></a>

### Places



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [Place](#Place) | repeated |  |






<a name=".TripData"></a>

### TripData



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| distance_in_meters | [int32](#int32) |  |  |
| time_in_ms | [int64](#int64) |  |  |






<a name=".TripData.HumanReadableTime"></a>

### TripData.HumanReadableTime



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| days | [int32](#int32) |  |  |
| hours | [int32](#int32) |  |  |
| minutes | [int32](#int32) |  |  |
| seconds | [int32](#int32) |  |  |
| display | [string](#string) |  |  |





 

 

 


<a name=".MapService"></a>

### MapService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Geocode | [.Place](#Place) | [.Coordinates](#Coordinates) |  |
| DistanceMatrix | [.MatrixRequest](#MatrixRequest) | [.Place](#Place) |  |
| Elevation | [.Coordinates](#Coordinates) | [.Double](#Double) |  |

 



<a name="logger.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## logger.proto



<a name=".Logger"></a>

### Logger



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;logger_id&#34; |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34;  |
| activity_name | [string](#string) |  | database name:&#34;activity_name&#34; |
| activity | [string](#string) |  | database name:&#34;activity&#34; |
| activity_date | [string](#string) |  | database name:&#34;activity_date&#34; |
| activity_end_date | [string](#string) |  | database name:&#34;activity_end_date&#34;  |
| property_id | [int32](#int32) |  | database name:&#34;property_id&#34;  |
| contract_id | [int32](#int32) |  | database name:&#34;contract_id&#34;  |
| customer_id | [int32](#int32) |  | database name:&#34;customer_id&#34;  |
| task_id | [int32](#int32) |  | database name:&#34;task_id&#34;  |
| task_event_id | [int32](#int32) |  | database name:&#34;task_event_id&#34;  |
| timesheet_line_id | [int32](#int32) |  | database name:&#34;timesheet_line_id&#34;  |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| srid | [int32](#int32) |  | database name:&#34;srid&#34;  |
| tech_id | [int32](#int32) |  | database name:&#34;tech_id&#34;  |
| geolocation_lat | [double](#double) |  | database name:&#34;geolocation_lat&#34;  |
| geolocation_lng | [double](#double) |  | database name:&#34;geolocation_lng&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".LoggerList"></a>

### LoggerList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Logger](#Logger) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".LoggerService"></a>

### LoggerService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Logger](#Logger) | [.Logger](#Logger) |  |
| Get | [.Logger](#Logger) | [.Logger](#Logger) |  |
| BatchGet | [.Logger](#Logger) | [.LoggerList](#LoggerList) |  |
| List | [.Logger](#Logger) | [.Logger](#Logger) stream |  |
| Update | [.Logger](#Logger) | [.Logger](#Logger) |  |
| Delete | [.Logger](#Logger) | [.Logger](#Logger) |  |

 



<a name="maintenance_question.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## maintenance_question.proto



<a name=".MaintenanceQuestion"></a>

### MaintenanceQuestion



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;m_q_id&#34; |
| tstat_brand | [string](#string) |  | database name:&#34;tstat_brand&#34;  |
| thermostat | [int32](#int32) |  | database name:&#34;Thermostat&#34;  |
| plateform | [int32](#int32) |  | database name:&#34;plateform&#34;  |
| float_switch | [int32](#int32) |  | database name:&#34;float_switch&#34;  |
| evaporator_coil | [int32](#int32) |  | database name:&#34;evaporator_coil&#34;  |
| condenser_coil | [int32](#int32) |  | database name:&#34;condenser_coil&#34;  |
| hurricane_pad | [int32](#int32) |  | database name:&#34;hurricane_pad&#34;  |
| lineset | [int32](#int32) |  | database name:&#34;lineset&#34;  |
| drain_line | [int32](#int32) |  | database name:&#34;drain_line&#34;  |
| gas_type | [int32](#int32) |  | database name:&#34;gas_type&#34;  |
| burner | [int32](#int32) |  | database name:&#34;burner&#34;  |
| heat_exchanger | [int32](#int32) |  | database name:&#34;heat_exchanger&#34;  |
| condition_notes1 | [string](#string) |  | database name:&#34;condition_notes1&#34;  |
| condition_notes2 | [string](#string) |  | database name:&#34;condition_notes2&#34;  |
| condition_notes3 | [string](#string) |  | database name:&#34;condition_notes3&#34;  |
| condition_rating1 | [string](#string) |  | database name:&#34;condition_rating1&#34;  |
| condition_rating2 | [string](#string) |  | database name:&#34;condition_rating2&#34;  |
| condition_rating3 | [string](#string) |  | database name:&#34;condition_rating3&#34;  |
| reading_id | [int32](#int32) |  | database name:&#34;reading_id&#34; |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".MaintenanceQuestionList"></a>

### MaintenanceQuestionList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [MaintenanceQuestion](#MaintenanceQuestion) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".MaintenanceQuestionService"></a>

### MaintenanceQuestionService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.MaintenanceQuestion](#MaintenanceQuestion) | [.MaintenanceQuestion](#MaintenanceQuestion) |  |
| Get | [.MaintenanceQuestion](#MaintenanceQuestion) | [.MaintenanceQuestion](#MaintenanceQuestion) |  |
| BatchGet | [.MaintenanceQuestion](#MaintenanceQuestion) | [.MaintenanceQuestionList](#MaintenanceQuestionList) |  |
| List | [.MaintenanceQuestion](#MaintenanceQuestion) | [.MaintenanceQuestion](#MaintenanceQuestion) stream |  |
| Update | [.MaintenanceQuestion](#MaintenanceQuestion) | [.MaintenanceQuestion](#MaintenanceQuestion) |  |
| Delete | [.MaintenanceQuestion](#MaintenanceQuestion) | [.MaintenanceQuestion](#MaintenanceQuestion) |  |

 



<a name="material.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## material.proto



<a name=".Material"></a>

### Material



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;material_id&#34; |
| service_item_id | [int32](#int32) |  | database name:&#34;serviceItem_id&#34; |
| name | [string](#string) |  | database name:&#34;material_name&#34;  |
| part_number | [string](#string) |  | database name:&#34;material_partNumber&#34;  |
| vendor | [string](#string) |  | database name:&#34;material_vendor&#34;  |
| quantity | [string](#string) |  | database name:&#34;material_quantity&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".MaterialList"></a>

### MaterialList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Material](#Material) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".MaterialService"></a>

### MaterialService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Material](#Material) | [.Material](#Material) |  |
| Get | [.Material](#Material) | [.Material](#Material) |  |
| BatchGet | [.Material](#Material) | [.MaterialList](#MaterialList) |  |
| List | [.Material](#Material) | [.Material](#Material) stream |  |
| Update | [.Material](#Material) | [.Material](#Material) |  |
| Delete | [.Material](#Material) | [.Material](#Material) |  |

 



<a name="metrics.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## metrics.proto



<a name=".AvgTicket"></a>

### AvgTicket



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| value | [double](#double) |  | database name:&#34;average_cost&#34; |






<a name=".Billable"></a>

### Billable



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| value | [double](#double) |  | database name:&#34;billable_per_hour&#34; |






<a name=".Callbacks"></a>

### Callbacks



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| value | [double](#double) |  | database name:&#34;callbacks&#34; |






<a name=".Revenue"></a>

### Revenue



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| value | [double](#double) |  | database name:&#34;income&#34; |





 

 

 


<a name=".MetricsService"></a>

### MetricsService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetBillable | [.Billable](#Billable) | [.Billable](#Billable) |  |
| ListBillable | [.Billable](#Billable) | [.Billable](#Billable) stream |  |
| GetAvgTicket | [.AvgTicket](#AvgTicket) | [.AvgTicket](#AvgTicket) |  |
| ListAvgTicket | [.AvgTicket](#AvgTicket) | [.AvgTicket](#AvgTicket) stream |  |
| GetCallbacks | [.Callbacks](#Callbacks) | [.Callbacks](#Callbacks) |  |
| ListCallbacks | [.Callbacks](#Callbacks) | [.Callbacks](#Callbacks) stream |  |
| GetRevenue | [.Revenue](#Revenue) | [.Revenue](#Revenue) |  |
| ListRevenue | [.Revenue](#Revenue) | [.Revenue](#Revenue) stream |  |

 



<a name="payment.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## payment.proto



<a name=".Payment"></a>

### Payment



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;payment_id&#34; |
| services_rendered_id | [int32](#int32) |  | database name:&#34;services_rendered_id&#34;  |
| collected | [int32](#int32) |  | database name:&#34;payment_collected&#34; |
| type | [string](#string) |  | database name:&#34;payment_type&#34;  |
| payee_user_id | [int32](#int32) |  | database name:&#34;payeeUser_id&#34;  |
| amount_collected | [double](#double) |  | database name:&#34;amount_collected&#34;  |
| dl_number | [string](#string) |  | database name:&#34;payment_dl_number&#34;  |
| auth_key | [string](#string) |  | database name:&#34;payment_auth_key&#34;  |
| cheque_number | [string](#string) |  | database name:&#34;payment_cheque_number&#34;  |
| is_invoice_data | [int32](#int32) |  | database name:&#34;is_invoice_data&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".PaymentList"></a>

### PaymentList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Payment](#Payment) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".PaymentService"></a>

### PaymentService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Payment](#Payment) | [.Payment](#Payment) |  |
| Get | [.Payment](#Payment) | [.Payment](#Payment) |  |
| BatchGet | [.Payment](#Payment) | [.PaymentList](#PaymentList) |  |
| List | [.Payment](#Payment) | [.Payment](#Payment) stream |  |
| Update | [.Payment](#Payment) | [.Payment](#Payment) |  |
| Delete | [.Payment](#Payment) | [.Payment](#Payment) |  |

 



<a name="pdf.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## pdf.proto



<a name=".HTML"></a>

### HTML



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [string](#string) |  |  |
| key | [string](#string) |  |  |
| bucket | [string](#string) |  |  |





 

 

 


<a name=".PDFService"></a>

### PDFService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.HTML](#HTML) | [.URLObject](#URLObject) |  |

 



<a name="pending_billing.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## pending_billing.proto



<a name=".PendingBilling"></a>

### PendingBilling



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34; |
| property_id | [int32](#int32) |  | database name:&#34;property_id&#34; |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34; |
| customer_name | [string](#string) |  | database name:&#34;customer_name&#34; |
| business_name | [string](#string) |  | database name:&#34;business_name&#34;  |
| date_completed | [string](#string) |  | database name:&#34;date_completed&#34; |
| address | [string](#string) |  | database name:&#34;address&#34; |
| page_number | [int32](#int32) |  |  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |






<a name=".PendingBillingList"></a>

### PendingBillingList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [PendingBilling](#PendingBilling) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".PendingBillingService"></a>

### PendingBillingService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Get | [.PendingBilling](#PendingBilling) | [.PendingBilling](#PendingBilling) |  |
| BatchGet | [.PendingBilling](#PendingBilling) | [.PendingBillingList](#PendingBillingList) |  |
| List | [.PendingBilling](#PendingBilling) | [.PendingBilling](#PendingBilling) stream |  |

 



<a name="perdiem.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## perdiem.proto



<a name=".PerDiem"></a>

### PerDiem



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| date_started | [string](#string) |  | database name:&#34;date_started&#34; |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34; |
| department_id | [int32](#int32) |  | database name:&#34;department_id&#34; |
| notes | [string](#string) |  | database name:&#34;notes&#34;  |
| owner_name | [string](#string) |  | database name:&#34;owner_name&#34; select_func:&#34;name_of_user&#34; func_arg_name:&#34;user_id&#34; ignore:&#34;y&#34; |
| is_active | [bool](#bool) |  | database name:&#34;is_active&#34; |
| date_submitted | [string](#string) |  | database name:&#34;date_submitted&#34;  |
| date_approved | [string](#string) |  | database name:&#34;date_approved&#34;  |
| approved_by_id | [int32](#int32) |  | database name:&#34;approved_by_id&#34;  |
| approved_by_name | [string](#string) |  | database name:&#34;approved_by_name&#34; select_func:&#34;name_of_user&#34; func_arg_name:&#34;approved_by_id&#34; ignore:&#34;y&#34; |
| needs_auditing | [bool](#bool) |  | database name:&#34;needs_auditing&#34; |
| department | [TimesheetDepartment](#TimesheetDepartment) |  | foreign_key:&#34;id&#34; foreign_table:&#34;timesheet_department&#34; local_name:&#34;department_id&#34; |
| with_rows | [bool](#bool) |  |  |
| rows | [PerDiemRow](#PerDiemRow) | repeated |  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |
| without_limit | [bool](#bool) |  |  |






<a name=".PerDiemList"></a>

### PerDiemList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [PerDiem](#PerDiem) | repeated |  |
| total_count | [int32](#int32) |  |  |






<a name=".PerDiemReportRequest"></a>

### PerDiemReportRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| week | [string](#string) | repeated |  |
| user_id | [int32](#int32) | repeated |  |
| department_id | [int32](#int32) | repeated |  |






<a name=".PerDiemRow"></a>

### PerDiemRow



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| per_diem_id | [int32](#int32) |  | database name:&#34;per_diem_id&#34; |
| zip_code | [string](#string) |  | database name:&#34;zip_code&#34;  |
| service_call_id | [int32](#int32) |  | database name:&#34;service_call_id&#34;  |
| notes | [string](#string) |  | database name:&#34;notes&#34;  |
| date_string | [string](#string) |  | database name:&#34;date_string&#34; |
| meals_only | [bool](#bool) |  | database name:&#34;meals_only&#34; |
| field_mask | [string](#string) | repeated |  |






<a name=".PerDiemRowList"></a>

### PerDiemRowList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| rows | [PerDiemRow](#PerDiemRow) | repeated |  |
| count | [int32](#int32) |  |  |





 

 

 


<a name=".PerDiemService"></a>

### PerDiemService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.PerDiem](#PerDiem) | [.PerDiem](#PerDiem) |  |
| Get | [.PerDiem](#PerDiem) | [.PerDiem](#PerDiem) |  |
| BatchGet | [.PerDiem](#PerDiem) | [.PerDiemList](#PerDiemList) |  |
| Update | [.PerDiem](#PerDiem) | [.PerDiem](#PerDiem) |  |
| Delete | [.PerDiem](#PerDiem) | [.PerDiem](#PerDiem) |  |
| CreateRow | [.PerDiemRow](#PerDiemRow) | [.PerDiemRow](#PerDiemRow) |  |
| UpdateRow | [.PerDiemRow](#PerDiemRow) | [.PerDiemRow](#PerDiemRow) |  |
| DeleteRow | [.PerDiemRow](#PerDiemRow) | [.Empty](#Empty) |  |
| GetPerDiemReport | [.PerDiemReportRequest](#PerDiemReportRequest) | [.PerDiemList](#PerDiemList) |  |

 



<a name="phone_call_log.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## phone_call_log.proto



<a name=".PhoneCallLog"></a>

### PhoneCallLog



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;phone_call_id&#34; |
| jive_call_id | [string](#string) |  | database name:&#34;jive_call_id&#34;  |
| call_timestamp | [string](#string) |  | database name:&#34;call_timestamp&#34;  |
| dialed_number | [string](#string) |  | database name:&#34;dialed_number&#34;  |
| caller_id_name | [string](#string) |  | database name:&#34;caller_id_name&#34;  |
| caller_id_number | [string](#string) |  | database name:&#34;caller_id_number&#34;  |
| phone_call_recording_link | [string](#string) |  | database name:&#34;phone_call_recording_link&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".PhoneCallLogList"></a>

### PhoneCallLogList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [PhoneCallLog](#PhoneCallLog) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".PhoneCallLogService"></a>

### PhoneCallLogService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.PhoneCallLog](#PhoneCallLog) | [.PhoneCallLog](#PhoneCallLog) |  |
| Get | [.PhoneCallLog](#PhoneCallLog) | [.PhoneCallLog](#PhoneCallLog) |  |
| BatchGet | [.PhoneCallLog](#PhoneCallLog) | [.PhoneCallLogList](#PhoneCallLogList) |  |
| List | [.PhoneCallLog](#PhoneCallLog) | [.PhoneCallLog](#PhoneCallLog) stream |  |
| Update | [.PhoneCallLog](#PhoneCallLog) | [.PhoneCallLog](#PhoneCallLog) |  |
| Delete | [.PhoneCallLog](#PhoneCallLog) | [.PhoneCallLog](#PhoneCallLog) |  |

 



<a name="predict.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## predict.proto



<a name=".Prediction"></a>

### Prediction



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| predicated_label | [string](#string) |  |  |
| predicted_scores | [Prediction.PredictedScoresEntry](#Prediction.PredictedScoresEntry) | repeated |  |






<a name=".Prediction.PredictedScoresEntry"></a>

### Prediction.PredictedScoresEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [double](#double) |  |  |






<a name=".TransactionData"></a>

### TransactionData



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| vendor | [string](#string) |  |  |
| amount | [double](#double) |  |  |
| notes | [string](#string) |  |  |
| owner_id | [int32](#int32) |  |  |





 

 

 


<a name=".PredictService"></a>

### PredictService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| PredictCostCenter | [.TransactionData](#TransactionData) | [.Prediction](#Prediction) |  |

 



<a name="prompt_payment_override.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## prompt_payment_override.proto



<a name=".PromptPaymentOverride"></a>

### PromptPaymentOverride



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;override_id&#34; |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| force_award | [int32](#int32) |  | database name:&#34;override_forceAward&#34;  |
| force_forfeit | [int32](#int32) |  | database name:&#34;override_forceForfeit&#34;  |
| reason | [string](#string) |  | database name:&#34;override_reason&#34;  |
| date | [string](#string) |  | database name:&#34;override_date&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".PromptPaymentOverrideList"></a>

### PromptPaymentOverrideList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [PromptPaymentOverride](#PromptPaymentOverride) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".PromptPaymentOverrideService"></a>

### PromptPaymentOverrideService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.PromptPaymentOverride](#PromptPaymentOverride) | [.PromptPaymentOverride](#PromptPaymentOverride) |  |
| Get | [.PromptPaymentOverride](#PromptPaymentOverride) | [.PromptPaymentOverride](#PromptPaymentOverride) |  |
| BatchGet | [.PromptPaymentOverride](#PromptPaymentOverride) | [.PromptPaymentOverrideList](#PromptPaymentOverrideList) |  |
| List | [.PromptPaymentOverride](#PromptPaymentOverride) | [.PromptPaymentOverride](#PromptPaymentOverride) stream |  |
| Update | [.PromptPaymentOverride](#PromptPaymentOverride) | [.PromptPaymentOverride](#PromptPaymentOverride) |  |
| Delete | [.PromptPaymentOverride](#PromptPaymentOverride) | [.PromptPaymentOverride](#PromptPaymentOverride) |  |

 



<a name="prompt_payment_rebate.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## prompt_payment_rebate.proto



<a name=".PromptPaymentRebate"></a>

### PromptPaymentRebate



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;rebate_id&#34; |
| payment_id | [int32](#int32) |  | database name:&#34;rebate_payment_id&#34;  |
| event_id | [int32](#int32) |  | database name:&#34;rebate_event_id&#34;  |
| amount | [double](#double) |  | database name:&#34;rebate_amount&#34;  |
| date | [string](#string) |  | database name:&#34;rebate_date&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".PromptPaymentRebateList"></a>

### PromptPaymentRebateList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [PromptPaymentRebate](#PromptPaymentRebate) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".PromptPaymentRebateService"></a>

### PromptPaymentRebateService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.PromptPaymentRebate](#PromptPaymentRebate) | [.PromptPaymentRebate](#PromptPaymentRebate) |  |
| Get | [.PromptPaymentRebate](#PromptPaymentRebate) | [.PromptPaymentRebate](#PromptPaymentRebate) |  |
| BatchGet | [.PromptPaymentRebate](#PromptPaymentRebate) | [.PromptPaymentRebateList](#PromptPaymentRebateList) |  |
| List | [.PromptPaymentRebate](#PromptPaymentRebate) | [.PromptPaymentRebate](#PromptPaymentRebate) stream |  |
| Update | [.PromptPaymentRebate](#PromptPaymentRebate) | [.PromptPaymentRebate](#PromptPaymentRebate) |  |
| Delete | [.PromptPaymentRebate](#PromptPaymentRebate) | [.PromptPaymentRebate](#PromptPaymentRebate) |  |

 



<a name="prop_link.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## prop_link.proto



<a name=".PropLink"></a>

### PropLink



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;prop_link_id&#34; |
| property_id | [int32](#int32) |  | database name:&#34;property_id&#34; |
| url | [string](#string) |  | database name:&#34;prop_link_url&#34;  |
| description | [string](#string) |  | database name:&#34;prop_link_description&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".PropLinkList"></a>

### PropLinkList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [PropLink](#PropLink) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".PropLinkService"></a>

### PropLinkService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.PropLink](#PropLink) | [.PropLink](#PropLink) |  |
| Get | [.PropLink](#PropLink) | [.PropLink](#PropLink) |  |
| BatchGet | [.PropLink](#PropLink) | [.PropLinkList](#PropLinkList) |  |
| List | [.PropLink](#PropLink) | [.PropLink](#PropLink) stream |  |
| Update | [.PropLink](#PropLink) | [.PropLink](#PropLink) |  |
| Delete | [.PropLink](#PropLink) | [.PropLink](#PropLink) |  |

 



<a name="property.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## property.proto



<a name=".Property"></a>

### Property



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;property_id&#34; |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34;  |
| contract_id | [int32](#int32) |  | database name:&#34;contract_id&#34;  |
| address | [string](#string) |  | database name:&#34;property_address&#34;  |
| city | [string](#string) |  | database name:&#34;property_city&#34;  |
| state | [string](#string) |  | database name:&#34;property_state&#34;  |
| zip | [string](#string) |  | database name:&#34;property_zip&#34;  |
| subdivision | [string](#string) |  | database name:&#34;property_subdivision&#34;  |
| directions | [string](#string) |  | database name:&#34;property_directions&#34;  |
| notes | [string](#string) |  | database name:&#34;property_notes&#34;  |
| date_created | [string](#string) |  | database name:&#34;property_date_created&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;property_isActive&#34; |
| is_residential | [int32](#int32) |  | database name:&#34;property_isResidential&#34;  |
| notification | [string](#string) |  | database name:&#34;property_notification&#34;  |
| firstname | [string](#string) |  | database name:&#34;property_firstname&#34;  |
| lastname | [string](#string) |  | database name:&#34;property_lastname&#34;  |
| businessname | [string](#string) |  | database name:&#34;property_businessname&#34;  |
| phone | [string](#string) |  | database name:&#34;property_phone&#34;  |
| altphone | [string](#string) |  | database name:&#34;property_altphone&#34;  |
| email | [string](#string) |  | database name:&#34;property_email&#34;  |
| geolocation_lat | [double](#double) |  | database name:&#34;geolocation_lat&#34;  |
| geolocation_lng | [double](#double) |  | database name:&#34;geolocation_lng&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".PropertyList"></a>

### PropertyList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Property](#Property) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".PropertyService"></a>

### PropertyService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Property](#Property) | [.Property](#Property) |  |
| Get | [.Property](#Property) | [.Property](#Property) |  |
| BatchGet | [.Property](#Property) | [.PropertyList](#PropertyList) |  |
| List | [.Property](#Property) | [.Property](#Property) stream |  |
| Update | [.Property](#Property) | [.Property](#Property) |  |
| Delete | [.Property](#Property) | [.Property](#Property) |  |

 



<a name="quote.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## quote.proto



<a name=".Quote"></a>

### Quote



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;quote_id&#34; |
| line_id | [int32](#int32) |  | database name:&#34;quote_line_id&#34;  |
| readings_id | [int32](#int32) |  | database name:&#34;readings_id&#34;  |
| price | [double](#double) |  | database name:&#34;quote_price&#34;  |
| document_id | [int32](#int32) |  | database name:&#34;document_id&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".QuoteList"></a>

### QuoteList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Quote](#Quote) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".QuoteService"></a>

### QuoteService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Quote](#Quote) | [.Quote](#Quote) |  |
| Get | [.Quote](#Quote) | [.Quote](#Quote) |  |
| BatchGet | [.Quote](#Quote) | [.QuoteList](#QuoteList) |  |
| List | [.Quote](#Quote) | [.Quote](#Quote) stream |  |
| Update | [.Quote](#Quote) | [.Quote](#Quote) |  |
| Delete | [.Quote](#Quote) | [.Quote](#Quote) |  |

 



<a name="quote_document.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## quote_document.proto



<a name=".QuoteDocument"></a>

### QuoteDocument



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| document_id | [int32](#int32) |  | database name:&#34;document_id&#34;  |
| property_id | [int32](#int32) |  | database name:&#34;property_id&#34;  |
| reading_id | [int32](#int32) |  | database name:&#34;reading_id&#34;  |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| job_notes | [string](#string) |  | database name:&#34;job_notes&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".QuoteDocumentList"></a>

### QuoteDocumentList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [QuoteDocument](#QuoteDocument) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".QuoteDocumentService"></a>

### QuoteDocumentService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.QuoteDocument](#QuoteDocument) | [.QuoteDocument](#QuoteDocument) |  |
| Get | [.QuoteDocument](#QuoteDocument) | [.QuoteDocument](#QuoteDocument) |  |
| BatchGet | [.QuoteDocument](#QuoteDocument) | [.QuoteDocumentList](#QuoteDocumentList) |  |
| List | [.QuoteDocument](#QuoteDocument) | [.QuoteDocument](#QuoteDocument) stream |  |
| Update | [.QuoteDocument](#QuoteDocument) | [.QuoteDocument](#QuoteDocument) |  |
| Delete | [.QuoteDocument](#QuoteDocument) | [.QuoteDocument](#QuoteDocument) |  |

 



<a name="quote_line.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## quote_line.proto



<a name=".QuoteLine"></a>

### QuoteLine



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;quote_line_id&#34; |
| quote_type | [int32](#int32) |  | database name:&#34;quote_type&#34;  |
| labor | [string](#string) |  | database name:&#34;labor&#34;  |
| refrigerant_lbs | [string](#string) |  | database name:&#34;refrigerant_lbs&#34;  |
| adjustment | [string](#string) |  | database name:&#34;adjustment&#34;  |
| is_flatrate | [string](#string) |  | database name:&#34;isFlatrate&#34;  |
| description | [string](#string) |  | database name:&#34;description&#34;  |
| diagnosis | [string](#string) |  | database name:&#34;diagnosis&#34;  |
| warranty | [int32](#int32) |  | database name:&#34;warranty&#34;  |
| quote_reference | [string](#string) |  | database name:&#34;quote_reference&#34;  |
| job_number | [string](#string) |  | database name:&#34;jobNumber&#34;  |
| quote_status | [int32](#int32) |  | database name:&#34;quote_status&#34;  |
| for_user | [int32](#int32) |  | database name:&#34;for_user&#34;  |
| item_id | [int32](#int32) |  | database name:&#34;item_id&#34;  |
| photo_id | [int32](#int32) |  | database name:&#34;photo_id&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;isActive&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".QuoteLineList"></a>

### QuoteLineList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [QuoteLine](#QuoteLine) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".QuoteLineService"></a>

### QuoteLineService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.QuoteLine](#QuoteLine) | [.QuoteLine](#QuoteLine) |  |
| Get | [.QuoteLine](#QuoteLine) | [.QuoteLine](#QuoteLine) |  |
| BatchGet | [.QuoteLine](#QuoteLine) | [.QuoteLineList](#QuoteLineList) |  |
| List | [.QuoteLine](#QuoteLine) | [.QuoteLine](#QuoteLine) stream |  |
| Update | [.QuoteLine](#QuoteLine) | [.QuoteLine](#QuoteLine) |  |
| Delete | [.QuoteLine](#QuoteLine) | [.QuoteLine](#QuoteLine) |  |

 



<a name="quote_line_part.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## quote_line_part.proto



<a name=".QuoteLinePart"></a>

### QuoteLinePart



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;quote_line_part_id&#34; |
| quote_line_id | [int32](#int32) |  | database name:&#34;quote_line_id&#34;  |
| quote_part_id | [int32](#int32) |  | database name:&#34;quote_part_id&#34;  |
| quantity | [double](#double) |  | database name:&#34;quantity&#34; |
| markup | [double](#double) |  | database name:&#34;markup&#34;  |
| tax | [double](#double) |  | database name:&#34;tax&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".QuoteLinePartList"></a>

### QuoteLinePartList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [QuoteLinePart](#QuoteLinePart) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".QuoteLinePartService"></a>

### QuoteLinePartService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.QuoteLinePart](#QuoteLinePart) | [.QuoteLinePart](#QuoteLinePart) |  |
| Get | [.QuoteLinePart](#QuoteLinePart) | [.QuoteLinePart](#QuoteLinePart) |  |
| BatchGet | [.QuoteLinePart](#QuoteLinePart) | [.QuoteLinePartList](#QuoteLinePartList) |  |
| List | [.QuoteLinePart](#QuoteLinePart) | [.QuoteLinePart](#QuoteLinePart) stream |  |
| Update | [.QuoteLinePart](#QuoteLinePart) | [.QuoteLinePart](#QuoteLinePart) |  |
| Delete | [.QuoteLinePart](#QuoteLinePart) | [.QuoteLinePart](#QuoteLinePart) |  |

 



<a name="quote_part.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## quote_part.proto



<a name=".QuotePart"></a>

### QuotePart



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;part_id&#34; |
| description | [string](#string) |  | database name:&#34;part_description&#34;  |
| vendor | [string](#string) |  | database name:&#34;part_vendor&#34;  |
| cost | [double](#double) |  | database name:&#34;part_cost&#34;  |
| availability | [int32](#int32) |  | database name:&#34;part_availability&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".QuotePartList"></a>

### QuotePartList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [QuotePart](#QuotePart) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".QuotePartService"></a>

### QuotePartService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.QuotePart](#QuotePart) | [.QuotePart](#QuotePart) |  |
| Get | [.QuotePart](#QuotePart) | [.QuotePart](#QuotePart) |  |
| BatchGet | [.QuotePart](#QuotePart) | [.QuotePartList](#QuotePartList) |  |
| List | [.QuotePart](#QuotePart) | [.QuotePart](#QuotePart) stream |  |
| Update | [.QuotePart](#QuotePart) | [.QuotePart](#QuotePart) |  |
| Delete | [.QuotePart](#QuotePart) | [.QuotePart](#QuotePart) |  |

 



<a name="quote_used.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## quote_used.proto



<a name=".QuoteUsed"></a>

### QuoteUsed



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;quote_used_id&#34; |
| services_rendered_id | [int32](#int32) |  | database name:&#34;services_rendered_id&#34;  |
| quote_line_id | [int32](#int32) |  | database name:&#34;quote_line_id&#34;  |
| quantity | [double](#double) |  | database name:&#34;quantity&#34;  |
| quoted_price | [double](#double) |  | database name:&#34;quoted_price&#34;  |
| billable | [int32](#int32) |  | database name:&#34;billable&#34;  |
| lmpc | [int32](#int32) |  | database name:&#34;lmpc&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".QuoteUsedList"></a>

### QuoteUsedList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [QuoteUsed](#QuoteUsed) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".QuoteUsedService"></a>

### QuoteUsedService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.QuoteUsed](#QuoteUsed) | [.QuoteUsed](#QuoteUsed) |  |
| Get | [.QuoteUsed](#QuoteUsed) | [.QuoteUsed](#QuoteUsed) |  |
| BatchGet | [.QuoteUsed](#QuoteUsed) | [.QuoteUsedList](#QuoteUsedList) |  |
| List | [.QuoteUsed](#QuoteUsed) | [.QuoteUsed](#QuoteUsed) stream |  |
| Update | [.QuoteUsed](#QuoteUsed) | [.QuoteUsed](#QuoteUsed) |  |
| Delete | [.QuoteUsed](#QuoteUsed) | [.QuoteUsed](#QuoteUsed) |  |

 



<a name="reading.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## reading.proto



<a name=".Reading"></a>

### Reading



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;reading_id&#34; |
| service_item_id | [int32](#int32) |  | database name:&#34;serviceItem_id&#34;  |
| date | [string](#string) |  | database name:&#34;reading_date&#34;  |
| tstat_type | [string](#string) |  | database name:&#34;tstat_type&#34;  |
| tstat_brand | [string](#string) |  | database name:&#34;tstat_brand&#34;  |
| compressor_amps | [string](#string) |  | database name:&#34;compressor_amps&#34;  |
| condensing_fan_amps | [string](#string) |  | database name:&#34;condensing_fan_amps&#34;  |
| suction_pressure | [string](#string) |  | database name:&#34;suction_pressure&#34;  |
| head_pressure | [string](#string) |  | database name:&#34;head_pressure&#34;  |
| return_temperature | [string](#string) |  | database name:&#34;return_temperature&#34;  |
| supply_temperature | [string](#string) |  | database name:&#34;supply_temperature&#34;  |
| subcool | [string](#string) |  | database name:&#34;subcool&#34;  |
| superheat | [string](#string) |  | database name:&#34;superheat&#34;  |
| notes | [string](#string) |  | database name:&#34;reading_notes&#34;  |
| display_unckecked | [int32](#int32) |  | database name:&#34;display_unckecked&#34;  |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34;  |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| refrigerant_type | [string](#string) |  | database name:&#34;refrigerant_type&#34;  |
| blower_amps | [string](#string) |  | database name:&#34;blower_amps&#34;  |
| condenser_fan_capacitor | [string](#string) |  | database name:&#34;condenser_fan_capacitor&#34;  |
| compressor_capacitor | [string](#string) |  | database name:&#34;compressor_capacitor&#34;  |
| blower_capacitor | [string](#string) |  | database name:&#34;blower_capacitor&#34;  |
| discharge_temperature | [string](#string) |  | database name:&#34;discharge_temperature&#34;  |
| pool_supply_temp | [string](#string) |  | database name:&#34;pool_supply_temp&#34;  |
| pool_return_temp | [string](#string) |  | database name:&#34;pool_return_temp&#34;  |
| ambient_air_temp | [string](#string) |  | database name:&#34;ambient_air_temp&#34;  |
| return_db | [string](#string) |  | database name:&#34;return_db&#34;  |
| return_wb | [string](#string) |  | database name:&#34;return_wb&#34;  |
| evap_td | [string](#string) |  | database name:&#34;evap_td&#34;  |
| coil_static_drop | [string](#string) |  | database name:&#34;coil_static_drop&#34;  |
| tesp | [string](#string) |  | database name:&#34;tesp&#34;  |
| gas_pressure_in | [string](#string) |  | database name:&#34;gas_pressure_in&#34;  |
| gas_pressure_out | [string](#string) |  | database name:&#34;gas_pressure_out&#34;  |
| ll_temp_drop | [string](#string) |  | database name:&#34;ll_temp_drop&#34;  |
| sl_temp_drop | [string](#string) |  | database name:&#34;sl_temp_drop&#34;  |
| services_rendered_id | [int32](#int32) |  | database name:&#34;services_rendered_id&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".ReadingList"></a>

### ReadingList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Reading](#Reading) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".ReadingService"></a>

### ReadingService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Reading](#Reading) | [.Reading](#Reading) |  |
| Get | [.Reading](#Reading) | [.Reading](#Reading) |  |
| BatchGet | [.Reading](#Reading) | [.ReadingList](#ReadingList) |  |
| List | [.Reading](#Reading) | [.Reading](#Reading) stream |  |
| Update | [.Reading](#Reading) | [.Reading](#Reading) |  |
| Delete | [.Reading](#Reading) | [.Reading](#Reading) |  |

 



<a name="remote_identity.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## remote_identity.proto



<a name=".RemoteIdentity"></a>

### RemoteIdentity



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| user_id | [int32](#int32) |  | database name:&#34;userId&#34;  |
| service | [string](#string) |  | database name:&#34;service&#34;  |
| identity_string | [string](#string) |  | database name:&#34;identityString&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".RemoteIdentityList"></a>

### RemoteIdentityList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [RemoteIdentity](#RemoteIdentity) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".RemoteIdentityService"></a>

### RemoteIdentityService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.RemoteIdentity](#RemoteIdentity) | [.RemoteIdentity](#RemoteIdentity) |  |
| Get | [.RemoteIdentity](#RemoteIdentity) | [.RemoteIdentity](#RemoteIdentity) |  |
| BatchGet | [.RemoteIdentity](#RemoteIdentity) | [.RemoteIdentityList](#RemoteIdentityList) |  |
| List | [.RemoteIdentity](#RemoteIdentity) | [.RemoteIdentity](#RemoteIdentity) stream |  |
| Update | [.RemoteIdentity](#RemoteIdentity) | [.RemoteIdentity](#RemoteIdentity) |  |
| Delete | [.RemoteIdentity](#RemoteIdentity) | [.RemoteIdentity](#RemoteIdentity) |  |

 



<a name="reports.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## reports.proto



<a name=".PromptPaymentReport"></a>

### PromptPaymentReport



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [PromptPaymentReportLine](#PromptPaymentReportLine) | repeated |  |






<a name=".PromptPaymentReportLine"></a>

### PromptPaymentReportLine



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34; |
| billingDate | [string](#string) |  | database name:&#34;log_billingDate&#34;  |
| due_date | [string](#string) |  | database name:&#34;dueDate&#34;  |
| payment_date | [string](#string) |  | database name:&#34;paymentDate&#34;  |
| report_until | [string](#string) |  | database name:&#34;reportUntil&#34;  |
| days_to_pay | [int32](#int32) |  | database name:&#34;daysToPay&#34;  |
| job_number | [string](#string) |  | database name:&#34;log_jobNumber&#34;  |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34;  |
| user_business_name | [string](#string) |  | database name:&#34;user_businessName&#34;  |
| user_email | [string](#string) |  | database name:&#34;user_email&#34;  |
| payable | [double](#double) |  | database name:&#34;payable&#34;  |
| payed | [double](#double) |  | database name:&#34;payed&#34;  |
| payment_terms | [int32](#int32) |  | database name:&#34;paymentTerms&#34;  |
| eligible_rate | [double](#double) |  | database name:&#34;eligibleRate&#34;  |
| possible_award | [double](#double) |  | database name:&#34;possibleAward&#34;  |
| rebate_amount | [double](#double) |  | database name:&#34;rebate_amount&#34;  |
| rebate_date | [string](#string) |  | database name:&#34;rebate_date&#34;  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |
| date_target | [string](#string) | repeated |  |
| date_range | [string](#string) | repeated | date_target:&#34;log_billingDate&#34; |






<a name=".SpiffReport"></a>

### SpiffReport



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [SpiffReportLine](#SpiffReportLine) | repeated |  |






<a name=".SpiffReportData"></a>

### SpiffReportData







<a name=".SpiffReportLine"></a>

### SpiffReportLine



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| employee_id | [int32](#int32) |  | database name:&#34;employee_id&#34;  |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| contract_id | [int32](#int32) |  | database name:&#34;contract_id&#34;  |
| type_id | [int32](#int32) |  | database name:&#34;type_id&#34;  |
| status_id | [int32](#int32) |  | database name:&#34;status_id&#34;  |
| category | [string](#string) |  | database name:&#34;category&#34;  |
| description | [string](#string) |  | database name:&#34;description&#34;  |
| amount | [double](#double) |  | database name:&#34;amount&#34;  |
| timestamp | [string](#string) |  | database name:&#34;timestamp&#34;  |
| pay_year | [int32](#int32) |  | database name:&#34;pay_year&#34;  |
| pay_month | [int32](#int32) |  | database name:&#34;pay_month&#34;  |
| pay_week | [int32](#int32) |  | database name:&#34;pay_week&#34;  |
| is_paid_weekly | [bool](#bool) |  | database name:&#34;is_paid_weekly&#34;  |
| is_paid_monthly | [bool](#bool) |  | database name:&#34;is_paid_monthly&#34;  |
| is_active | [bool](#bool) |  | database name:&#34;is_active&#34;  |
| employee_name | [string](#string) |  | database name:&#34;employee_name&#34; select_func:&#34;name_of_user&#34; func_arg_name:&#34;employee_id&#34; ignore:&#34;y&#34; |
| address | [string](#string) |  | database name:&#34;address&#34; select_func:&#34;address_by_event_id&#34; func_arg_name:&#34;event_id&#34; ignore:&#34;y&#34; |
| job_number | [string](#string) |  | database name:&#34;job_number&#34; select_func:&#34;job_number_by_event_id&#34; func_arg_name:&#34;event_id&#34; ignore:&#34;y&#34; |
| ext | [string](#string) |  | database name:&#34;ext&#34;  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |
| date_target | [string](#string) | repeated |  |
| date_range | [string](#string) | repeated | date_target:&#34;timestamp&#34; |





 

 

 


<a name=".ReportService"></a>

### ReportService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetSpiffReportData | [.SpiffReportLine](#SpiffReportLine) | [.SpiffReport](#SpiffReport) |  |
| GetPromptPaymentData | [.PromptPaymentReportLine](#PromptPaymentReportLine) | [.PromptPaymentReport](#PromptPaymentReport) |  |

 



<a name="s3.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## s3.proto



<a name=".BucketObject"></a>

### BucketObject



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| name | [string](#string) |  |  |
| region | [string](#string) |  |  |






<a name=".FileObject"></a>

### FileObject



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  |  |
| bucket | [string](#string) |  |  |
| key | [string](#string) |  |  |
| tag_string | [string](#string) |  |  |
| mime_type | [string](#string) |  |  |
| created_at | [string](#string) |  |  |
| uri | [string](#string) |  |  |
| data | [bytes](#bytes) |  |  |
| acl | [ACL](#ACL) |  |  |






<a name=".FileObjects"></a>

### FileObjects



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [FileObject](#FileObject) | repeated |  |






<a name=".MoveConfig"></a>

### MoveConfig



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| source | [FileObject](#FileObject) |  |  |
| destination | [FileObject](#FileObject) |  |  |
| preserve_source | [bool](#bool) |  |  |






<a name=".URLObject"></a>

### URLObject



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| url | [string](#string) |  |  |
| bucket | [string](#string) |  |  |
| content_type | [string](#string) |  |  |
| key | [string](#string) |  |  |
| acl | [ACL](#ACL) |  |  |
| tag_string | [string](#string) |  |  |





 


<a name=".ACL"></a>

### ACL


| Name | Number | Description |
| ---- | ------ | ----------- |
| Private | 0 |  |
| PublicRead | 1 |  |
| PublicReadWrite | 2 |  |


 

 


<a name=".BucketService"></a>

### BucketService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.BucketObject](#BucketObject) | [.BucketObject](#BucketObject) |  |
| Get | [.BucketObject](#BucketObject) | [.FileObjects](#FileObjects) |  |
| Delete | [.BucketObject](#BucketObject) | [.BucketObject](#BucketObject) |  |


<a name=".S3Service"></a>

### S3Service


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.FileObject](#FileObject) | [.FileObject](#FileObject) |  |
| Get | [.FileObject](#FileObject) | [.FileObject](#FileObject) |  |
| Delete | [.FileObject](#FileObject) | [.FileObject](#FileObject) |  |
| Move | [.MoveConfig](#MoveConfig) | [.Empty](#Empty) |  |
| GetUploadURL | [.URLObject](#URLObject) | [.URLObject](#URLObject) |  |
| GetDownloadURL | [.URLObject](#URLObject) | [.URLObject](#URLObject) |  |

 



<a name="service_item.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## service_item.proto



<a name=".ServiceItem"></a>

### ServiceItem



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;serviceItem_id&#34; |
| property_id | [int32](#int32) |  | database name:&#34;property_id&#34; |
| type | [string](#string) |  | database name:&#34;serviceItem_type&#34;  |
| item | [string](#string) |  | database name:&#34;serviceItem_item&#34;  |
| brand | [string](#string) |  | database name:&#34;serviceItem_brand&#34;  |
| start_date | [string](#string) |  | database name:&#34;serviceItem_startDate&#34;  |
| model | [string](#string) |  | database name:&#34;serviceItem_model&#34;  |
| serial | [string](#string) |  | database name:&#34;serviceItem_serial&#34;  |
| item2 | [string](#string) |  | database name:&#34;serviceItem_item2&#34;  |
| brand2 | [string](#string) |  | database name:&#34;serviceItem_brand2&#34;  |
| model2 | [string](#string) |  | database name:&#34;serviceItem_model2&#34;  |
| serial2 | [string](#string) |  | database name:&#34;serviceItem_serial2&#34;  |
| item3 | [string](#string) |  | database name:&#34;serviceItem_item3&#34;  |
| brand3 | [string](#string) |  | database name:&#34;serviceItem_brand3&#34;  |
| model3 | [string](#string) |  | database name:&#34;serviceItem_model3&#34;  |
| serial3 | [string](#string) |  | database name:&#34;serviceItem_serial3&#34;  |
| filter_size | [string](#string) |  | database name:&#34;serviceItem_filterSize&#34;  |
| location | [string](#string) |  | database name:&#34;serviceItem_location&#34;  |
| notes | [string](#string) |  | database name:&#34;serviceItem_notes&#34;  |
| belt_size | [string](#string) |  | database name:&#34;serviceItem_beltSize&#34;  |
| filter_width | [string](#string) |  | database name:&#34;serviceItem_filterWidth&#34;  |
| filter_length | [string](#string) |  | database name:&#34;serviceItem_filterLength&#34;  |
| filter_thickness | [string](#string) |  | database name:&#34;serviceItem_filterThickness&#34;  |
| filter_qty | [string](#string) |  | database name:&#34;serviceItem_filterQty&#34;  |
| filter_part_number | [string](#string) |  | database name:&#34;serviceItem_filterPartNumber&#34;  |
| filter_vendor | [string](#string) |  | database name:&#34;serviceItem_filterVendor&#34;  |
| sort_order | [int32](#int32) |  | database name:&#34;serviceItem_sortOrder&#34;  |
| system_readings_type_id | [int32](#int32) |  | database name:&#34;system_readings_type_id&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;serviceItem_isActive&#34;  |
| refrigerant_type | [int32](#int32) |  | database name:&#34;serviceItem_refrigerant_type&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".ServiceItemList"></a>

### ServiceItemList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [ServiceItem](#ServiceItem) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".ServiceItemService"></a>

### ServiceItemService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.ServiceItem](#ServiceItem) | [.ServiceItem](#ServiceItem) |  |
| Get | [.ServiceItem](#ServiceItem) | [.ServiceItem](#ServiceItem) |  |
| BatchGet | [.ServiceItem](#ServiceItem) | [.ServiceItemList](#ServiceItemList) |  |
| List | [.ServiceItem](#ServiceItem) | [.ServiceItem](#ServiceItem) stream |  |
| Update | [.ServiceItem](#ServiceItem) | [.ServiceItem](#ServiceItem) |  |
| Delete | [.ServiceItem](#ServiceItem) | [.ServiceItem](#ServiceItem) |  |

 



<a name="service_item_image.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## service_item_image.proto



<a name=".ServiceItemImage"></a>

### ServiceItemImage



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| service_item_id | [int32](#int32) |  | database name:&#34;serviceItem_id&#34;  |
| image_title | [string](#string) |  | database name:&#34;image_title&#34;  |
| image_name | [string](#string) |  | database name:&#34;image_name&#34;  |
| date_created | [string](#string) |  | database name:&#34;dateCreated&#34; |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".ServiceItemImageList"></a>

### ServiceItemImageList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [ServiceItemImage](#ServiceItemImage) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".ServiceItemImageService"></a>

### ServiceItemImageService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.ServiceItemImage](#ServiceItemImage) | [.ServiceItemImage](#ServiceItemImage) |  |
| Get | [.ServiceItemImage](#ServiceItemImage) | [.ServiceItemImage](#ServiceItemImage) |  |
| BatchGet | [.ServiceItemImage](#ServiceItemImage) | [.ServiceItemImageList](#ServiceItemImageList) |  |
| List | [.ServiceItemImage](#ServiceItemImage) | [.ServiceItemImage](#ServiceItemImage) stream |  |
| Update | [.ServiceItemImage](#ServiceItemImage) | [.ServiceItemImage](#ServiceItemImage) |  |
| Delete | [.ServiceItemImage](#ServiceItemImage) | [.ServiceItemImage](#ServiceItemImage) |  |

 



<a name="service_item_material.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## service_item_material.proto



<a name=".ServiceItemMaterial"></a>

### ServiceItemMaterial



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;material_id&#34; |
| system_id | [int32](#int32) |  | database name:&#34;material_system_id&#34;  |
| type_id | [int32](#int32) |  | database name:&#34;material_type_id&#34;  |
| description | [string](#string) |  | database name:&#34;material_description&#34;  |
| part | [string](#string) |  | database name:&#34;material_part&#34;  |
| filter_width | [string](#string) |  | database name:&#34;material_filterWidth&#34;  |
| filter_height | [string](#string) |  | database name:&#34;material_filterHeight&#34;  |
| filter_thickness | [string](#string) |  | database name:&#34;material_filterThickness&#34;  |
| quantity | [string](#string) |  | database name:&#34;material_quantity&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;material_isActive&#34;  |
| vendor | [string](#string) |  | database name:&#34;material_vendor&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".ServiceItemMaterialList"></a>

### ServiceItemMaterialList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [ServiceItemMaterial](#ServiceItemMaterial) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".ServiceItemMaterialService"></a>

### ServiceItemMaterialService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.ServiceItemMaterial](#ServiceItemMaterial) | [.ServiceItemMaterial](#ServiceItemMaterial) |  |
| Get | [.ServiceItemMaterial](#ServiceItemMaterial) | [.ServiceItemMaterial](#ServiceItemMaterial) |  |
| BatchGet | [.ServiceItemMaterial](#ServiceItemMaterial) | [.ServiceItemMaterialList](#ServiceItemMaterialList) |  |
| List | [.ServiceItemMaterial](#ServiceItemMaterial) | [.ServiceItemMaterial](#ServiceItemMaterial) stream |  |
| Update | [.ServiceItemMaterial](#ServiceItemMaterial) | [.ServiceItemMaterial](#ServiceItemMaterial) |  |
| Delete | [.ServiceItemMaterial](#ServiceItemMaterial) | [.ServiceItemMaterial](#ServiceItemMaterial) |  |

 



<a name="service_item_unit.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## service_item_unit.proto



<a name=".ServiceItemUnit"></a>

### ServiceItemUnit



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;unit_id&#34; |
| system_id | [int32](#int32) |  | database name:&#34;unit_system_id&#34;  |
| type_id | [int32](#int32) |  | database name:&#34;unit_type_id&#34;  |
| description | [string](#string) |  | database name:&#34;unit_description&#34;  |
| brand | [string](#string) |  | database name:&#34;unit_brand&#34;  |
| model | [string](#string) |  | database name:&#34;unit_model&#34;  |
| serial | [string](#string) |  | database name:&#34;unit_serial&#34;  |
| location | [string](#string) |  | database name:&#34;unit_location&#34;  |
| notes | [string](#string) |  | database name:&#34;unit_notes&#34;  |
| started | [string](#string) |  | database name:&#34;unit_started&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;unit_isActive&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".ServiceItemUnitList"></a>

### ServiceItemUnitList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [ServiceItemUnit](#ServiceItemUnit) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".ServiceItemUnitService"></a>

### ServiceItemUnitService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.ServiceItemUnit](#ServiceItemUnit) | [.ServiceItemUnit](#ServiceItemUnit) |  |
| Get | [.ServiceItemUnit](#ServiceItemUnit) | [.ServiceItemUnit](#ServiceItemUnit) |  |
| BatchGet | [.ServiceItemUnit](#ServiceItemUnit) | [.ServiceItemUnitList](#ServiceItemUnitList) |  |
| List | [.ServiceItemUnit](#ServiceItemUnit) | [.ServiceItemUnit](#ServiceItemUnit) stream |  |
| Update | [.ServiceItemUnit](#ServiceItemUnit) | [.ServiceItemUnit](#ServiceItemUnit) |  |
| Delete | [.ServiceItemUnit](#ServiceItemUnit) | [.ServiceItemUnit](#ServiceItemUnit) |  |

 



<a name="service_reading_line.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## service_reading_line.proto



<a name=".ServiceReadingLine"></a>

### ServiceReadingLine



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;reading_line_id&#34; |
| reading_id | [int32](#int32) |  | database name:&#34;reading_id&#34;  |
| unit_id | [int32](#int32) |  | database name:&#34;unit_id&#34;  |
| type_id | [int32](#int32) |  | database name:&#34;reading_type_id&#34;  |
| value | [string](#string) |  | database name:&#34;reading_line_value&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".ServiceReadingLineList"></a>

### ServiceReadingLineList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [ServiceReadingLine](#ServiceReadingLine) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".ServiceReadingLineService"></a>

### ServiceReadingLineService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.ServiceReadingLine](#ServiceReadingLine) | [.ServiceReadingLine](#ServiceReadingLine) |  |
| Get | [.ServiceReadingLine](#ServiceReadingLine) | [.ServiceReadingLine](#ServiceReadingLine) |  |
| BatchGet | [.ServiceReadingLine](#ServiceReadingLine) | [.ServiceReadingLineList](#ServiceReadingLineList) |  |
| List | [.ServiceReadingLine](#ServiceReadingLine) | [.ServiceReadingLine](#ServiceReadingLine) stream |  |
| Update | [.ServiceReadingLine](#ServiceReadingLine) | [.ServiceReadingLine](#ServiceReadingLine) |  |
| Delete | [.ServiceReadingLine](#ServiceReadingLine) | [.ServiceReadingLine](#ServiceReadingLine) |  |

 



<a name="services_rendered.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services_rendered.proto



<a name=".ServicesRendered"></a>

### ServicesRendered



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;sr_id&#34; |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| technician_user_id | [int32](#int32) |  | database name:&#34;technician_user_id&#34;  |
| name | [string](#string) |  | database name:&#34;sr_name&#34; |
| materials_used | [string](#string) |  | database name:&#34;sr_materialsUsed&#34;  |
| service_rendered | [string](#string) |  | database name:&#34;sr_serviceRendered&#34;  |
| tech_notes | [string](#string) |  | database name:&#34;sr_techNotes&#34;  |
| status | [string](#string) |  | database name:&#34;sr_status&#34; |
| datetime | [string](#string) |  | database name:&#34;sr_datetime&#34; |
| time_started | [string](#string) |  | database name:&#34;time_started&#34;  |
| time_finished | [string](#string) |  | database name:&#34;time_finished&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;isactive&#34;  |
| hide_from_timesheet | [int32](#int32) |  | database name:&#34;hide_from_timesheet&#34;  |
| signature_id | [int32](#int32) |  | database name:&#34;signature_id&#34;  |
| signature_data | [string](#string) |  | database name:&#34;signatureData&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |
| date_range | [string](#string) | repeated | date_target:&#34;sr_datetime&#34; |
| date_target | [string](#string) | repeated |  |






<a name=".ServicesRenderedList"></a>

### ServicesRenderedList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [ServicesRendered](#ServicesRendered) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".ServicesRenderedService"></a>

### ServicesRenderedService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.ServicesRendered](#ServicesRendered) | [.ServicesRendered](#ServicesRendered) |  |
| Get | [.ServicesRendered](#ServicesRendered) | [.ServicesRendered](#ServicesRendered) |  |
| BatchGet | [.ServicesRendered](#ServicesRendered) | [.ServicesRenderedList](#ServicesRenderedList) |  |
| List | [.ServicesRendered](#ServicesRendered) | [.ServicesRendered](#ServicesRendered) stream |  |
| Update | [.ServicesRendered](#ServicesRendered) | [.ServicesRendered](#ServicesRendered) |  |
| Delete | [.ServicesRendered](#ServicesRendered) | [.ServicesRendered](#ServicesRendered) |  |

 



<a name="si_link.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## si_link.proto



<a name=".SiLink"></a>

### SiLink



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;si_link_id&#34; |
| service_item_id | [int32](#int32) |  | database name:&#34;serviceItem_id&#34; |
| url | [string](#string) |  | database name:&#34;si_link_url&#34;  |
| description | [string](#string) |  | database name:&#34;si_link_description&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".SiLinkList"></a>

### SiLinkList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [SiLink](#SiLink) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".SiLinkService"></a>

### SiLinkService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.SiLink](#SiLink) | [.SiLink](#SiLink) |  |
| Get | [.SiLink](#SiLink) | [.SiLink](#SiLink) |  |
| BatchGet | [.SiLink](#SiLink) | [.SiLinkList](#SiLinkList) |  |
| List | [.SiLink](#SiLink) | [.SiLink](#SiLink) stream |  |
| Update | [.SiLink](#SiLink) | [.SiLink](#SiLink) |  |
| Delete | [.SiLink](#SiLink) | [.SiLink](#SiLink) |  |

 



<a name="spiff_tool_admin_action.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## spiff_tool_admin_action.proto



<a name=".SpiffToolAdminAction"></a>

### SpiffToolAdminAction



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| task_id | [int32](#int32) |  | database name:&#34;task_id&#34;  |
| reviewed_by | [string](#string) |  | database name:&#34;reviewed_by&#34;  |
| status | [int32](#int32) |  | database name:&#34;status&#34;  |
| reason | [string](#string) |  | database name:&#34;reason&#34;  |
| decision_date | [string](#string) |  | database name:&#34;decision_date&#34;  |
| created_date | [string](#string) |  | database name:&#34;created_date&#34; |
| granted_date | [string](#string) |  | database name:&#34;granted_date&#34;  |
| revoked_date | [string](#string) |  | database name:&#34;revoked_date&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |
| date_range | [string](#string) | repeated | date_target: &#34;created_date&#34; |
| date_target | [string](#string) | repeated |  |






<a name=".SpiffToolAdminActionList"></a>

### SpiffToolAdminActionList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [SpiffToolAdminAction](#SpiffToolAdminAction) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".SpiffToolAdminActionService"></a>

### SpiffToolAdminActionService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.SpiffToolAdminAction](#SpiffToolAdminAction) | [.SpiffToolAdminAction](#SpiffToolAdminAction) |  |
| Get | [.SpiffToolAdminAction](#SpiffToolAdminAction) | [.SpiffToolAdminAction](#SpiffToolAdminAction) |  |
| BatchGet | [.SpiffToolAdminAction](#SpiffToolAdminAction) | [.SpiffToolAdminActionList](#SpiffToolAdminActionList) |  |
| List | [.SpiffToolAdminAction](#SpiffToolAdminAction) | [.SpiffToolAdminAction](#SpiffToolAdminAction) stream |  |
| Update | [.SpiffToolAdminAction](#SpiffToolAdminAction) | [.SpiffToolAdminAction](#SpiffToolAdminAction) |  |
| Delete | [.SpiffToolAdminAction](#SpiffToolAdminAction) | [.SpiffToolAdminAction](#SpiffToolAdminAction) |  |

 



<a name="stock_vendor.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## stock_vendor.proto



<a name=".StockVendor"></a>

### StockVendor



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;vendor_id&#34; |
| name | [string](#string) |  | database name:&#34;vendor_name&#34;  |
| location | [string](#string) |  | database name:&#34;vendor_location&#34;  |
| default_availability | [int32](#int32) |  | database name:&#34;vendor_default_availability&#34;  |
| account | [string](#string) |  | database name:&#34;vendor_account&#34;  |
| billing | [int32](#int32) |  | database name:&#34;vendor_billing&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".StockVendorList"></a>

### StockVendorList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [StockVendor](#StockVendor) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".StockVendorService"></a>

### StockVendorService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.StockVendor](#StockVendor) | [.StockVendor](#StockVendor) |  |
| Get | [.StockVendor](#StockVendor) | [.StockVendor](#StockVendor) |  |
| BatchGet | [.StockVendor](#StockVendor) | [.StockVendorList](#StockVendorList) |  |
| List | [.StockVendor](#StockVendor) | [.StockVendor](#StockVendor) stream |  |
| Update | [.StockVendor](#StockVendor) | [.StockVendor](#StockVendor) |  |
| Delete | [.StockVendor](#StockVendor) | [.StockVendor](#StockVendor) |  |

 



<a name="stored_quote.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## stored_quote.proto



<a name=".StoredQuote"></a>

### StoredQuote



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| description | [string](#string) |  | database name:&#34;description&#34;  |
| price | [int32](#int32) |  | database name:&#34;price&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".StoredQuoteList"></a>

### StoredQuoteList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [StoredQuote](#StoredQuote) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".StoredQuoteService"></a>

### StoredQuoteService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.StoredQuote](#StoredQuote) | [.StoredQuote](#StoredQuote) |  |
| Get | [.StoredQuote](#StoredQuote) | [.StoredQuote](#StoredQuote) |  |
| BatchGet | [.StoredQuote](#StoredQuote) | [.StoredQuoteList](#StoredQuoteList) |  |
| List | [.StoredQuote](#StoredQuote) | [.StoredQuote](#StoredQuote) stream |  |
| Update | [.StoredQuote](#StoredQuote) | [.StoredQuote](#StoredQuote) |  |
| Delete | [.StoredQuote](#StoredQuote) | [.StoredQuote](#StoredQuote) |  |

 



<a name="system_invoice_type.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## system_invoice_type.proto



<a name=".SystemInvoiceType"></a>

### SystemInvoiceType



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;system_invoice_type_id&#34; |
| system_reading_type_id | [int32](#int32) |  | database name:&#34;system_reading_type_id&#34;  |
| reading1 | [string](#string) |  | database name:&#34;reading1&#34;  |
| reading2 | [string](#string) |  | database name:&#34;reading2&#34;  |
| reading3 | [string](#string) |  | database name:&#34;reading3&#34;  |
| reading4 | [string](#string) |  | database name:&#34;reading4&#34;  |
| reading5 | [string](#string) |  | database name:&#34;reading5&#34;  |
| reading6 | [string](#string) |  | database name:&#34;reading6&#34;  |
| reading7 | [string](#string) |  | database name:&#34;reading7&#34;  |
| reading8 | [string](#string) |  | database name:&#34;reading8&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".SystemInvoiceTypeList"></a>

### SystemInvoiceTypeList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [SystemInvoiceType](#SystemInvoiceType) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".SystemInvoiceTypeService"></a>

### SystemInvoiceTypeService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.SystemInvoiceType](#SystemInvoiceType) | [.SystemInvoiceType](#SystemInvoiceType) |  |
| Get | [.SystemInvoiceType](#SystemInvoiceType) | [.SystemInvoiceType](#SystemInvoiceType) |  |
| BatchGet | [.SystemInvoiceType](#SystemInvoiceType) | [.SystemInvoiceTypeList](#SystemInvoiceTypeList) |  |
| List | [.SystemInvoiceType](#SystemInvoiceType) | [.SystemInvoiceType](#SystemInvoiceType) stream |  |
| Update | [.SystemInvoiceType](#SystemInvoiceType) | [.SystemInvoiceType](#SystemInvoiceType) |  |
| Delete | [.SystemInvoiceType](#SystemInvoiceType) | [.SystemInvoiceType](#SystemInvoiceType) |  |

 



<a name="system_readings_type.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## system_readings_type.proto



<a name=".SystemReadingsType"></a>

### SystemReadingsType



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;s_r_type_id&#34; |
| display_name | [string](#string) |  | database name:&#34;display_name&#34; |
| refrigerant_type | [int32](#int32) |  | database name:&#34;refrigerant_type&#34; |
| tstat_brand | [int32](#int32) |  | database name:&#34;tstat_brand&#34; |
| blower_capacitor | [int32](#int32) |  | database name:&#34;blower_capacitor&#34; |
| blower_amps | [int32](#int32) |  | database name:&#34;blower_amps&#34; |
| return_temperature | [int32](#int32) |  | database name:&#34;return_temperature&#34; |
| supply_temperature | [int32](#int32) |  | database name:&#34;supply_temperature&#34; |
| compressor_amps | [int32](#int32) |  | database name:&#34;compressor_amps&#34; |
| condensing_fan_amps | [int32](#int32) |  | database name:&#34;condensing_fan_amps&#34; |
| compressor_capacitor | [int32](#int32) |  | database name:&#34;compressor_capacitor&#34; |
| condenser_fan_capacitor | [int32](#int32) |  | database name:&#34;condenser_fan_capacitor&#34; |
| suction_pressure | [int32](#int32) |  | database name:&#34;suction_pressure&#34; |
| head_pressure | [int32](#int32) |  | database name:&#34;head_pressure&#34; |
| subcool | [int32](#int32) |  | database name:&#34;subcool&#34; |
| superheat | [int32](#int32) |  | database name:&#34;superheat&#34; |
| discharge_temperature | [int32](#int32) |  | database name:&#34;discharge_temperature&#34; |
| gas_type | [int32](#int32) |  | database name:&#34;gas_type&#34; |
| burner | [int32](#int32) |  | database name:&#34;burner&#34; |
| heat_exchanger | [int32](#int32) |  | database name:&#34;heat_exchanger&#34; |
| thermostat | [int32](#int32) |  | database name:&#34;thermostat&#34; |
| plateform | [int32](#int32) |  | database name:&#34;plateform&#34; |
| float_switch | [int32](#int32) |  | database name:&#34;float_switch&#34; |
| evaporator_coil | [int32](#int32) |  | database name:&#34;evaporator_coil&#34; |
| condenser_coil | [int32](#int32) |  | database name:&#34;condenser_coil&#34; |
| hurricane_pad | [int32](#int32) |  | database name:&#34;hurricane_pad&#34; |
| lineset | [int32](#int32) |  | database name:&#34;lineset&#34; |
| drain_line | [int32](#int32) |  | database name:&#34;drain_line&#34; |
| pool_supply_temp | [int32](#int32) |  | database name:&#34;pool_supply_temp&#34; |
| pool_return_temp | [int32](#int32) |  | database name:&#34;pool_return_temp&#34; |
| ambient_air_temp | [int32](#int32) |  | database name:&#34;ambient_air_temp&#34; |
| return_wb | [int32](#int32) |  | database name:&#34;return_wb&#34; |
| return_db | [int32](#int32) |  | database name:&#34;return_db&#34; |
| evap_td | [int32](#int32) |  | database name:&#34;evap_td&#34; |
| coil_static_drop | [int32](#int32) |  | database name:&#34;coil_static_drop&#34; |
| tesp | [int32](#int32) |  | database name:&#34;tesp&#34; |
| gas_pressure_in | [int32](#int32) |  | database name:&#34;gas_pressure_in&#34; |
| gas_pressure_out | [int32](#int32) |  | database name:&#34;gas_pressure_out&#34; |
| ll_temp_drop | [int32](#int32) |  | database name:&#34;ll_temp_drop&#34; |
| sl_temp_drop | [int32](#int32) |  | database name:&#34;sl_temp_drop&#34; |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".SystemReadingsTypeList"></a>

### SystemReadingsTypeList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [SystemReadingsType](#SystemReadingsType) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".SystemReadingsTypeService"></a>

### SystemReadingsTypeService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.SystemReadingsType](#SystemReadingsType) | [.SystemReadingsType](#SystemReadingsType) |  |
| Get | [.SystemReadingsType](#SystemReadingsType) | [.SystemReadingsType](#SystemReadingsType) |  |
| BatchGet | [.SystemReadingsType](#SystemReadingsType) | [.SystemReadingsTypeList](#SystemReadingsTypeList) |  |
| List | [.SystemReadingsType](#SystemReadingsType) | [.SystemReadingsType](#SystemReadingsType) stream |  |
| Update | [.SystemReadingsType](#SystemReadingsType) | [.SystemReadingsType](#SystemReadingsType) |  |
| Delete | [.SystemReadingsType](#SystemReadingsType) | [.SystemReadingsType](#SystemReadingsType) |  |

 



<a name="task.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## task.proto



<a name=".ProjectTask"></a>

### ProjectTask



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;task_id&#34; |
| external_id | [int32](#int32) |  | database name:&#34;external_id&#34; |
| external_code | [string](#string) |  | database name:&#34;external_code&#34;  |
| reference_number | [string](#string) |  | database name:&#34;reference_number&#34;  |
| creator_user_id | [int32](#int32) |  | database name:&#34;creator_user_id&#34; |
| time_created | [string](#string) |  | database name:&#34;time_created&#34; |
| brief_description | [string](#string) |  | database name:&#34;brief_description&#34;  |
| details | [string](#string) |  | database name:&#34;details&#34;  |
| notes | [string](#string) |  | database name:&#34;notes&#34;  |
| status_id | [int32](#int32) |  | database name:&#34;status_id&#34; |
| priority_id | [int32](#int32) |  | database name:&#34;priority_id&#34; |
| is_active | [bool](#bool) |  | database name:&#34;isActive&#34;  |
| start_date | [string](#string) |  | database name:&#34;hourly_start&#34;  |
| end_date | [string](#string) |  | database name:&#34;hourly_end&#34;  |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |
| date_range | [string](#string) | repeated | date_target:&#34;date_performed&#34; |
| date_target | [string](#string) | repeated |  |
| owner_name | [string](#string) |  |  |
| status | [TaskStatus](#TaskStatus) |  |  |
| priority | [TaskPriority](#TaskPriority) |  |  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |






<a name=".ProjectTaskList"></a>

### ProjectTaskList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [ProjectTask](#ProjectTask) | repeated |  |
| total_count | [int32](#int32) |  |  |






<a name=".Spiff"></a>

### Spiff



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| time_created | [string](#string) |  | database name:&#34;time_created&#34;  |
| brief_description | [string](#string) |  | database name:&#34;brief_description&#34;  |
| details | [string](#string) |  | database name:&#34;details&#34;  |
| notes | [string](#string) |  | database name:&#34;notes&#34;  |
| status_id | [int32](#int32) |  | database name:&#34;status_id&#34;  |
| spiff_amount | [double](#double) |  | database name:&#34;spiff_amount&#34;  |
| spiff_jobNumber | [string](#string) |  | database name:&#34;spiff_jobNumber&#34;  |
| spiff_type | [string](#string) |  | database name:&#34;spiff_type&#34;  |
| spiff_address | [string](#string) |  | database name:&#34;spiff_address&#34;  |
| reviewed_by | [string](#string) |  | database name:&#34;reviewed_by&#34;  |
| status | [string](#string) |  | database name:&#34;status&#34;  |
| reason | [string](#string) |  | database name:&#34;reason&#34;  |
| decision_date | [string](#string) |  | database name:&#34;decision_date&#34;  |
| external_id | [int32](#int32) |  | database name:&#34;external_id&#34;  |






<a name=".SpiffDuplicate"></a>

### SpiffDuplicate



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;task_id&#34; |
| spiff_type_id | [int32](#int32) |  | database name:&#34;spiff_type_id&#34;  |
| time_due | [string](#string) |  | database name:&#34;time_due&#34;  |
| owner_name | [string](#string) |  |  |
| actions | [SpiffToolAdminAction](#SpiffToolAdminAction) | repeated |  |






<a name=".SpiffList"></a>

### SpiffList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results_list | [Spiff](#Spiff) | repeated |  |






<a name=".SpiffType"></a>

### SpiffType



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;spiff_id&#34; |
| ext | [string](#string) |  | database name:&#34;spiff_ext&#34;  |
| type | [string](#string) |  | database name:&#34;spiff_type&#34;  |
| payout | [string](#string) |  | database name:&#34;spiff_payout&#34;  |
| duration | [string](#string) |  | database name:&#34;spiff_duration&#34;  |
| is_active | [bool](#bool) |  | database name:&#34;isActive&#34;  |






<a name=".SpiffTypeList"></a>

### SpiffTypeList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [SpiffType](#SpiffType) | repeated |  |
| total_count | [int32](#int32) |  |  |






<a name=".Task"></a>

### Task



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;task_id&#34; |
| external_id | [int32](#int32) |  | database name:&#34;external_id&#34; |
| external_code | [string](#string) |  | database name:&#34;external_code&#34;  |
| reference_number | [string](#string) |  | database name:&#34;reference_number&#34;  |
| creator_user_id | [int32](#int32) |  | database name:&#34;creator_user_id&#34; |
| time_created | [string](#string) |  | database name:&#34;time_created&#34; |
| time_due | [string](#string) |  | database name:&#34;time_due&#34;  |
| brief_description | [string](#string) |  | database name:&#34;brief_description&#34;  |
| details | [string](#string) |  | database name:&#34;details&#34;  |
| notes | [string](#string) |  | database name:&#34;notes&#34;  |
| status_id | [int32](#int32) |  | database name:&#34;status_id&#34; |
| priority_id | [int32](#int32) |  | database name:&#34;priority_id&#34; |
| reference_url | [string](#string) |  | database name:&#34;reference_url&#34;  |
| is_active | [bool](#bool) |  | database name:&#34;isActive&#34;  |
| billable | [int32](#int32) |  | database name:&#34;billable&#34; |
| billable_type | [string](#string) |  | database name:&#34;task_billable_type&#34;  |
| flat_rate | [double](#double) |  | database name:&#34;flat_rate&#34;  |
| hourly_start | [string](#string) |  | database name:&#34;hourly_start&#34;  |
| hourly_end | [string](#string) |  | database name:&#34;hourly_end&#34;  |
| address | [string](#string) |  | database name:&#34;address&#34;  |
| order_num | [string](#string) |  | database name:&#34;order_num&#34;  |
| spiff_amount | [double](#double) |  | database name:&#34;spiff_amount&#34; |
| spiff_job_number | [string](#string) |  | database name:&#34;spiff_jobNumber&#34;  |
| spiff_type_id | [int32](#int32) |  | database name:&#34;spiff_type_id&#34;  |
| spiff_address | [string](#string) |  | database name:&#34;spiff_address&#34;  |
| toolpurchase_date | [string](#string) |  | database name:&#34;toolpurchase_date&#34;  |
| toolpurchase_cost | [double](#double) |  | database name:&#34;toolpurchase_cost&#34; |
| toolpurchase_file | [string](#string) |  | database name:&#34;toolpurchase_file&#34;  |
| admin_action_id | [int32](#int32) |  | database name:&#34;admin_action_id&#34;  |
| date_performed | [string](#string) |  | database name:&#34;date_performed&#34;  |
| spiff_tool_id | [string](#string) |  | database name:&#34;spiff_tool_id&#34;  |
| spiff_tool_closeout_date | [string](#string) |  | database name:&#34;spiff_tool_closeout_date&#34;  |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |
| date_range | [string](#string) | repeated | date_target:&#34;date_performed&#34; |
| date_target | [string](#string) | repeated |  |
| event | [TaskEventData](#TaskEventData) |  |  |
| owner_name | [string](#string) |  |  |
| status | [TaskStatus](#TaskStatus) |  |  |
| actions | [SpiffToolAdminAction](#SpiffToolAdminAction) | repeated |  |
| reference_action | [SpiffToolAdminAction](#SpiffToolAdminAction) |  |  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |
| duplicates | [SpiffDuplicate](#SpiffDuplicate) | repeated |  |






<a name=".TaskBillableTypeList"></a>

### TaskBillableTypeList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| types | [string](#string) | repeated |  |






<a name=".TaskEventData"></a>

### TaskEventData



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| property_id | [int32](#int32) |  | database name:&#34;property_id&#34;  |
| customer_id | [int32](#int32) |  |  |
| contract_id | [int32](#int32) |  | database name:&#34;contract_id&#34;  |
| contract_number | [string](#string) |  | database name:&#34;contract_number&#34;  |
| log_job_number | [string](#string) |  | database name:&#34;log_jobNumber&#34;  |






<a name=".TaskList"></a>

### TaskList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Task](#Task) | repeated |  |
| total_count | [int32](#int32) |  |  |






<a name=".TaskPriority"></a>

### TaskPriority



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;task_priority_id&#34; |
| code | [string](#string) |  | database name:&#34;priority_code&#34; |
| description | [string](#string) |  | database name:&#34;priority_desc&#34; |






<a name=".TaskPriorityList"></a>

### TaskPriorityList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [TaskPriority](#TaskPriority) | repeated |  |






<a name=".TaskStatus"></a>

### TaskStatus



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;task_status_id&#34; |
| code | [string](#string) |  | database name:&#34;status_code&#34; |
| description | [string](#string) |  | database name:&#34;status_desc&#34; |
| weight | [int32](#int32) |  | database name:&#34;weight&#34; |






<a name=".TaskStatusList"></a>

### TaskStatusList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [TaskStatus](#TaskStatus) | repeated |  |






<a name=".ToolFund"></a>

### ToolFund



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  |  |
| value | [double](#double) |  |  |





 

 

 


<a name=".TaskService"></a>

### TaskService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Task](#Task) | [.Task](#Task) |  |
| CreateProjectTask | [.ProjectTask](#ProjectTask) | [.ProjectTask](#ProjectTask) |  |
| Get | [.Task](#Task) | [.Task](#Task) |  |
| GetProjectTask | [.ProjectTask](#ProjectTask) | [.ProjectTask](#ProjectTask) |  |
| BatchGet | [.Task](#Task) | [.TaskList](#TaskList) |  |
| BatchGetProjectTasks | [.ProjectTask](#ProjectTask) | [.ProjectTaskList](#ProjectTaskList) |  |
| List | [.Task](#Task) | [.Task](#Task) stream |  |
| Update | [.Task](#Task) | [.Task](#Task) |  |
| UpdateProjectTask | [.ProjectTask](#ProjectTask) | [.ProjectTask](#ProjectTask) |  |
| Delete | [.Task](#Task) | [.Task](#Task) |  |
| DeleteProjectTask | [.ProjectTask](#ProjectTask) | [.ProjectTask](#ProjectTask) |  |
| GetSpiffTypes | [.SpiffType](#SpiffType) | [.SpiffTypeList](#SpiffTypeList) |  |
| GetToolFundBalanceByID | [.ToolFund](#ToolFund) | [.ToolFund](#ToolFund) |  |
| GetAppliedSpiffs | [.Spiff](#Spiff) | [.SpiffList](#SpiffList) |  |
| GetTaskStatusList | [.TaskStatus](#TaskStatus) | [.TaskStatusList](#TaskStatusList) |  |
| GetTaskPriorityList | [.TaskPriority](#TaskPriority) | [.TaskPriorityList](#TaskPriorityList) |  |
| GetTaskBillableTypeList | [.Empty](#Empty) | [.StringList](#StringList) |  |

 



<a name="task_assignment.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## task_assignment.proto



<a name=".TaskAssignment"></a>

### TaskAssignment



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34;  |
| task_id | [int32](#int32) |  | database name:&#34;task_id&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;isActive&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".TaskAssignmentList"></a>

### TaskAssignmentList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [TaskAssignment](#TaskAssignment) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".TaskAssignmentService"></a>

### TaskAssignmentService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.TaskAssignment](#TaskAssignment) | [.TaskAssignment](#TaskAssignment) |  |
| Get | [.TaskAssignment](#TaskAssignment) | [.TaskAssignment](#TaskAssignment) |  |
| BatchGet | [.TaskAssignment](#TaskAssignment) | [.TaskAssignmentList](#TaskAssignmentList) |  |
| List | [.TaskAssignment](#TaskAssignment) | [.TaskAssignment](#TaskAssignment) stream |  |
| Update | [.TaskAssignment](#TaskAssignment) | [.TaskAssignment](#TaskAssignment) |  |
| Delete | [.TaskAssignment](#TaskAssignment) | [.TaskAssignment](#TaskAssignment) |  |

 



<a name="task_event.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## task_event.proto



<a name=".TaskEvent"></a>

### TaskEvent



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;task_event_id&#34; |
| task_id | [int32](#int32) |  | database name:&#34;task_id&#34;  |
| status_id | [int32](#int32) |  | database name:&#34;status_id&#34;  |
| action_taken | [string](#string) |  | database name:&#34;action_taken&#34;  |
| action_needed | [string](#string) |  | database name:&#34;action_needed&#34;  |
| time_started | [string](#string) |  | database name:&#34;time_started&#34;  |
| time_finished | [string](#string) |  | database name:&#34;time_finished&#34;  |
| technician_user_id | [int32](#int32) |  | database name:&#34;technician_user_id&#34;  |
| is_active | [bool](#bool) |  | database name:&#34;isactive&#34;  |
| latitude | [double](#double) |  | database name:&#34;geo_lat&#34; |
| longitude | [double](#double) |  | database name:&#34;geo_lng&#34; |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |






<a name=".TaskEventList"></a>

### TaskEventList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [TaskEvent](#TaskEvent) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".TaskEventService"></a>

### TaskEventService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.TaskEvent](#TaskEvent) | [.TaskEvent](#TaskEvent) |  |
| Get | [.TaskEvent](#TaskEvent) | [.TaskEvent](#TaskEvent) |  |
| BatchGet | [.TaskEvent](#TaskEvent) | [.TaskEventList](#TaskEventList) |  |
| List | [.TaskEvent](#TaskEvent) | [.TaskEvent](#TaskEvent) stream |  |
| Update | [.TaskEvent](#TaskEvent) | [.TaskEvent](#TaskEvent) |  |
| Delete | [.TaskEvent](#TaskEvent) | [.TaskEvent](#TaskEvent) |  |

 



<a name="timeoff_request.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## timeoff_request.proto



<a name=".PTO"></a>

### PTO



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  |  |
| years_worked | [double](#double) |  |  |
| days_available | [int32](#int32) |  |  |
| hours_available | [int32](#int32) |  |  |






<a name=".TimeoffRequest"></a>

### TimeoffRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| services_rendered_id | [int32](#int32) |  | database name:&#34;services_rendered_id&#34;  |
| task_event_id | [int32](#int32) |  | database name:&#34;task_event_id&#34;  |
| request_type | [int32](#int32) |  | database name:&#34;request_type&#34; |
| department_code | [int32](#int32) |  | database name:&#34;department_code&#34; |
| brief_description | [string](#string) |  | database name:&#34;brief_description&#34;  |
| reference_number | [string](#string) |  | database name:&#34;reference_number&#34;  |
| notes | [string](#string) |  | database name:&#34;notes&#34;  |
| reviewed_by | [string](#string) |  | database name:&#34;reviewed_by&#34;  |
| admin_comments | [string](#string) |  | database name:&#34;admin_comments&#34;  |
| admin_approval_user_id | [int32](#int32) |  | database name:&#34;admin_approval_user_id&#34;  |
| admin_approval_datetime | [string](#string) |  | database name:&#34;admin_approval_datetime&#34;  |
| user_approval_datetime | [string](#string) |  | database name:&#34;user_approval_datetime&#34;  |
| time_started | [string](#string) |  | database name:&#34;time_started&#34;  |
| time_finished | [string](#string) |  | database name:&#34;time_finished&#34;  |
| user_id | [string](#string) |  | database name:&#34;technician_user_id&#34;  |
| request_status | [int32](#int32) |  | database name:&#34;request_status&#34;  |
| all_day_off | [int32](#int32) |  | database name:&#34;all_day_off&#34; |
| is_roo_request | [int32](#int32) |  | database name:&#34;is_roo_request&#34; |
| user_name | [string](#string) |  | database name:&#34;user_name&#34; ignore:&#34;y&#34; |
| is_active | [int32](#int32) |  | database name:&#34;isactive&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".TimeoffRequestList"></a>

### TimeoffRequestList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [TimeoffRequest](#TimeoffRequest) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".TimeoffRequestService"></a>

### TimeoffRequestService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.TimeoffRequest](#TimeoffRequest) | [.TimeoffRequest](#TimeoffRequest) |  |
| Get | [.TimeoffRequest](#TimeoffRequest) | [.TimeoffRequest](#TimeoffRequest) |  |
| BatchGet | [.TimeoffRequest](#TimeoffRequest) | [.TimeoffRequestList](#TimeoffRequestList) |  |
| List | [.TimeoffRequest](#TimeoffRequest) | [.TimeoffRequest](#TimeoffRequest) stream |  |
| Update | [.TimeoffRequest](#TimeoffRequest) | [.TimeoffRequest](#TimeoffRequest) |  |
| Delete | [.TimeoffRequest](#TimeoffRequest) | [.TimeoffRequest](#TimeoffRequest) |  |
| PTOInquiry | [.PTO](#PTO) | [.PTO](#PTO) |  |

 



<a name="timesheet_classcode.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## timesheet_classcode.proto



<a name=".TimesheetClassCode"></a>

### TimesheetClassCode



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| description | [string](#string) |  | database name:&#34;description&#34;  |
| billable | [bool](#bool) |  | database name:&#34;billable&#34; |
| classcode_id | [int32](#int32) |  | database name:&#34;classcode_id&#34;  |
| classcode_qb_id | [int32](#int32) |  | database name:&#34;classcode_qb_id&#34;  |
| classcode_qb_name | [string](#string) |  | database name:&#34;classcode_qb_name&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".TimesheetClassCodeList"></a>

### TimesheetClassCodeList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [TimesheetClassCode](#TimesheetClassCode) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".TimesheetClassCodeService"></a>

### TimesheetClassCodeService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.TimesheetClassCode](#TimesheetClassCode) | [.TimesheetClassCode](#TimesheetClassCode) |  |
| Get | [.TimesheetClassCode](#TimesheetClassCode) | [.TimesheetClassCode](#TimesheetClassCode) |  |
| BatchGet | [.TimesheetClassCode](#TimesheetClassCode) | [.TimesheetClassCodeList](#TimesheetClassCodeList) |  |
| List | [.TimesheetClassCode](#TimesheetClassCode) | [.TimesheetClassCode](#TimesheetClassCode) stream |  |
| Update | [.TimesheetClassCode](#TimesheetClassCode) | [.TimesheetClassCode](#TimesheetClassCode) |  |
| Delete | [.TimesheetClassCode](#TimesheetClassCode) | [.TimesheetClassCode](#TimesheetClassCode) |  |

 



<a name="timesheet_department.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## timesheet_department.proto



<a name=".TimesheetDepartment"></a>

### TimesheetDepartment



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| value | [string](#string) |  | database name:&#34;value&#34; |
| description | [string](#string) |  | database name:&#34;description&#34;  |
| manager_id | [int32](#int32) |  | database name:&#34;manager_id&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;isActive&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".TimesheetDepartmentList"></a>

### TimesheetDepartmentList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [TimesheetDepartment](#TimesheetDepartment) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".TimesheetDepartmentService"></a>

### TimesheetDepartmentService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.TimesheetDepartment](#TimesheetDepartment) | [.TimesheetDepartment](#TimesheetDepartment) |  |
| Get | [.TimesheetDepartment](#TimesheetDepartment) | [.TimesheetDepartment](#TimesheetDepartment) |  |
| BatchGet | [.TimesheetDepartment](#TimesheetDepartment) | [.TimesheetDepartmentList](#TimesheetDepartmentList) |  |
| List | [.TimesheetDepartment](#TimesheetDepartment) | [.TimesheetDepartment](#TimesheetDepartment) stream |  |
| Update | [.TimesheetDepartment](#TimesheetDepartment) | [.TimesheetDepartment](#TimesheetDepartment) |  |
| Delete | [.TimesheetDepartment](#TimesheetDepartment) | [.TimesheetDepartment](#TimesheetDepartment) |  |

 



<a name="timesheet_line.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## timesheet_line.proto



<a name=".SubmitApproveReq"></a>

### SubmitApproveReq



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| ids | [int32](#int32) | repeated |  |
| user_id | [int32](#int32) |  |  |






<a name=".Timesheet"></a>

### Timesheet



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| dates | [Timesheet.DatesEntry](#Timesheet.DatesEntry) | repeated |  |






<a name=".Timesheet.DatesEntry"></a>

### Timesheet.DatesEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [TimesheetDay](#TimesheetDay) |  |  |






<a name=".TimesheetDay"></a>

### TimesheetDay



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| services_rendered | [ServicesRendered](#ServicesRendered) | repeated |  |
| timesheet_line | [TimesheetLine](#TimesheetLine) | repeated |  |






<a name=".TimesheetLine"></a>

### TimesheetLine



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| event_id | [int32](#int32) |  | database name:&#34;event_id&#34;  |
| services_rendered_id | [int32](#int32) |  | database name:&#34;services_rendered_id&#34;  |
| task_event_id | [int32](#int32) |  | database name:&#34;task_event_id&#34;  |
| class_code_id | [int32](#int32) |  | database name:&#34;class_code&#34; |
| department_code | [int32](#int32) |  | database name:&#34;department_code&#34; |
| brief_description | [string](#string) |  | database name:&#34;brief_description&#34;  |
| reference_number | [string](#string) |  | database name:&#34;reference_number&#34;  |
| notes | [string](#string) |  | database name:&#34;notes&#34;  |
| admin_approval_user_id | [int32](#int32) |  | database name:&#34;admin_approval_user_id&#34;  |
| admin_approval_datetime | [string](#string) |  | database name:&#34;admin_approval_datetime&#34;  |
| user_approval_datetime | [string](#string) |  | database name:&#34;user_approval_datetime&#34;  |
| time_started | [string](#string) |  | database name:&#34;time_started&#34;  |
| time_finished | [string](#string) |  | database name:&#34;time_finished&#34;  |
| technician_user_id | [int32](#int32) |  | database name:&#34;technician_user_id&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;isactive&#34;  |
| class_code | [TimesheetClassCode](#TimesheetClassCode) |  |  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |
| date_range | [string](#string) | repeated | date_target:&#34;time_started&#34; |
| date_target | [string](#string) | repeated |  |






<a name=".TimesheetLineList"></a>

### TimesheetLineList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [TimesheetLine](#TimesheetLine) | repeated |  |
| total_count | [int32](#int32) |  |  |






<a name=".TimesheetReq"></a>

### TimesheetReq



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| timesheet_line | [TimesheetLine](#TimesheetLine) |  |  |
| services_rendered | [ServicesRendered](#ServicesRendered) |  |  |





 

 

 


<a name=".TimesheetLineService"></a>

### TimesheetLineService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.TimesheetLine](#TimesheetLine) | [.TimesheetLine](#TimesheetLine) |  |
| Get | [.TimesheetLine](#TimesheetLine) | [.TimesheetLine](#TimesheetLine) |  |
| GetTimesheet | [.TimesheetReq](#TimesheetReq) | [.Timesheet](#Timesheet) |  |
| BatchGet | [.TimesheetLine](#TimesheetLine) | [.TimesheetLineList](#TimesheetLineList) |  |
| List | [.TimesheetLine](#TimesheetLine) | [.TimesheetLine](#TimesheetLine) stream |  |
| Update | [.TimesheetLine](#TimesheetLine) | [.TimesheetLine](#TimesheetLine) |  |
| Delete | [.TimesheetLine](#TimesheetLine) | [.TimesheetLine](#TimesheetLine) |  |
| Submit | [.SubmitApproveReq](#SubmitApproveReq) | [.Empty](#Empty) |  |
| Approve | [.SubmitApproveReq](#SubmitApproveReq) | [.Empty](#Empty) |  |

 



<a name="transaction.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## transaction.proto



<a name=".RecordPageReq"></a>

### RecordPageReq



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| transaction_ids | [int32](#int32) | repeated |  |
| request_data | [Transaction](#Transaction) |  |  |






<a name=".Transaction"></a>

### Transaction



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| job_id | [int32](#int32) |  | database name:&#34;job_id&#34;  |
| department_id | [int32](#int32) |  | database name:&#34;department_id&#34;  |
| owner_id | [int32](#int32) |  | database name:&#34;owner_id&#34;  |
| vendor | [string](#string) |  | database name:&#34;vendor&#34;  |
| cost_center_id | [int32](#int32) |  | database name:&#34;cost_center_id&#34;  |
| description | [string](#string) |  | database name:&#34;description&#34;  |
| amount | [double](#double) |  | database name:&#34;amount&#34;  |
| timestamp | [string](#string) |  | database name:&#34;timestamp&#34;  |
| notes | [string](#string) |  | database name:&#34;notes&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;is_active&#34;  |
| status_id | [int32](#int32) |  | database name:&#34;status_id&#34; |
| is_audited | [bool](#bool) |  | database name:&#34;is_audited&#34; |
| is_recorded | [bool](#bool) |  | database name:&#34;is_recorded&#34; |
| artifical_id | [string](#string) |  | database name:&#34;artificial_id&#34;  |
| status | [string](#string) |  | @inect_tag: database name:&#34;status&#34; select_func:&#34;transaction_status_name&#34; func_arg_name:&#34;status_id&#34; ignore:&#34;y&#34; |
| owner_name | [string](#string) |  | database name:&#34;owner_name&#34; select_func:&#34;name_of_user&#34; func_arg_name:&#34;owner_id&#34; ignore:&#34;y&#34; |
| card_used | [string](#string) |  | database name:&#34;card_used&#34; select_func:&#34;card_by_user&#34; func_arg_name:&#34;owner_id&#34; ignore:&#34;y&#34; |
| department_string | [string](#string) |  | database name:&#34;department_string&#34; select_func:&#34;get_department_string&#34; func_arg_name:&#34;department_id&#34; ignore:&#34;y&#34; |
| cost_center_string | [string](#string) |  | database name:&#34;cost_center_string&#34; select_func:&#34;get_cost_center&#34; func_arg_name:&#34;cost_center_id&#34; ignore:&#34;y&#34; |
| documents | [TransactionDocument](#TransactionDocument) | repeated |  |
| activity_log | [TransactionActivity](#TransactionActivity) | repeated |  |
| page_number | [int32](#int32) |  |  |
| field_mask | [string](#string) | repeated |  |
| department | [TxnDepartment](#TxnDepartment) |  |  |
| cost_center | [TransactionAccount](#TransactionAccount) |  |  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |
| search_phrase | [string](#string) |  |  |






<a name=".TransactionList"></a>

### TransactionList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Transaction](#Transaction) | repeated |  |
| total_count | [int32](#int32) |  |  |






<a name=".TxnDepartment"></a>

### TxnDepartment



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  |  |
| description | [string](#string) |  |  |
| manager_id | [int32](#int32) |  |  |
| classification | [string](#string) |  |  |





 

 

 


<a name=".TransactionService"></a>

### TransactionService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Transaction](#Transaction) | [.Transaction](#Transaction) |  |
| Get | [.Transaction](#Transaction) | [.Transaction](#Transaction) |  |
| BatchGet | [.Transaction](#Transaction) | [.TransactionList](#TransactionList) |  |
| List | [.Transaction](#Transaction) | [.Transaction](#Transaction) stream |  |
| Search | [.Transaction](#Transaction) | [.TransactionList](#TransactionList) |  |
| Update | [.Transaction](#Transaction) | [.Transaction](#Transaction) |  |
| Delete | [.Transaction](#Transaction) | [.Transaction](#Transaction) |  |
| RecordPage | [.RecordPageReq](#RecordPageReq) | [.TransactionList](#TransactionList) |  |

 



<a name="transaction_account.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## transaction_account.proto



<a name=".TransactionAccount"></a>

### TransactionAccount



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| account_category | [int32](#int32) |  | database name:&#34;account_category&#34;  |
| threshold_amount | [double](#double) |  | database name:&#34;threshold_amount&#34;  |
| description | [string](#string) |  | database name:&#34;description&#34;  |
| needs_po | [int32](#int32) |  | database name:&#34;needs_PO&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;is_active&#34;  |
| popularity | [int32](#int32) |  | database name:&#34;popularity&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".TransactionAccountList"></a>

### TransactionAccountList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [TransactionAccount](#TransactionAccount) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".TransactionAccountService"></a>

### TransactionAccountService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.TransactionAccount](#TransactionAccount) | [.TransactionAccount](#TransactionAccount) |  |
| Get | [.TransactionAccount](#TransactionAccount) | [.TransactionAccount](#TransactionAccount) |  |
| BatchGet | [.TransactionAccount](#TransactionAccount) | [.TransactionAccountList](#TransactionAccountList) |  |
| List | [.TransactionAccount](#TransactionAccount) | [.TransactionAccount](#TransactionAccount) stream |  |
| Update | [.TransactionAccount](#TransactionAccount) | [.TransactionAccount](#TransactionAccount) |  |
| Delete | [.TransactionAccount](#TransactionAccount) | [.TransactionAccount](#TransactionAccount) |  |

 



<a name="transaction_activity.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## transaction_activity.proto



<a name=".TransactionActivity"></a>

### TransactionActivity



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| transaction_id | [int32](#int32) |  | database name:&#34;transaction_id&#34;  |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34;  |
| status_id | [int32](#int32) |  | database name:&#34;status_id&#34;  |
| description | [string](#string) |  | database name:&#34;description&#34;  |
| timestamp | [string](#string) |  | database name:&#34;timestamp&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;is_active&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".TransactionActivityList"></a>

### TransactionActivityList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [TransactionActivity](#TransactionActivity) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".TransactionActivityService"></a>

### TransactionActivityService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.TransactionActivity](#TransactionActivity) | [.TransactionActivity](#TransactionActivity) |  |
| Get | [.TransactionActivity](#TransactionActivity) | [.TransactionActivity](#TransactionActivity) |  |
| BatchGet | [.TransactionActivity](#TransactionActivity) | [.TransactionActivityList](#TransactionActivityList) |  |
| List | [.TransactionActivity](#TransactionActivity) | [.TransactionActivity](#TransactionActivity) stream |  |
| Update | [.TransactionActivity](#TransactionActivity) | [.TransactionActivity](#TransactionActivity) |  |
| Delete | [.TransactionActivity](#TransactionActivity) | [.TransactionActivity](#TransactionActivity) |  |

 



<a name="transaction_document.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## transaction_document.proto



<a name=".TransactionDocument"></a>

### TransactionDocument



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| transaction_id | [int32](#int32) |  | database name:&#34;transaction_id&#34;  |
| file_id | [int32](#int32) |  | database name:&#34;file_id&#34;  |
| type_id | [int32](#int32) |  | database name:&#34;type_id&#34;  |
| description | [string](#string) |  | database name:&#34;description&#34;  |
| reference | [string](#string) |  | database name:&#34;reference&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".TransactionDocumentList"></a>

### TransactionDocumentList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [TransactionDocument](#TransactionDocument) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".TransactionDocumentService"></a>

### TransactionDocumentService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.TransactionDocument](#TransactionDocument) | [.TransactionDocument](#TransactionDocument) |  |
| Get | [.TransactionDocument](#TransactionDocument) | [.TransactionDocument](#TransactionDocument) |  |
| BatchGet | [.TransactionDocument](#TransactionDocument) | [.TransactionDocumentList](#TransactionDocumentList) |  |
| List | [.TransactionDocument](#TransactionDocument) | [.TransactionDocument](#TransactionDocument) stream |  |
| Update | [.TransactionDocument](#TransactionDocument) | [.TransactionDocument](#TransactionDocument) |  |
| Delete | [.TransactionDocument](#TransactionDocument) | [.TransactionDocument](#TransactionDocument) |  |

 



<a name="transaction_status.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## transaction_status.proto



<a name=".TransactionStatus"></a>

### TransactionStatus



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| description | [string](#string) |  | database name:&#34;description&#34; |






<a name=".TransactionStatusList"></a>

### TransactionStatusList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [TransactionStatus](#TransactionStatus) | repeated |  |





 

 

 


<a name=".TransactionStatusService"></a>

### TransactionStatusService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Get | [.TransactionStatus](#TransactionStatus) | [.TransactionStatus](#TransactionStatus) |  |
| BatchGet | [.TransactionStatus](#TransactionStatus) | [.TransactionStatusList](#TransactionStatusList) |  |
| List | [.TransactionStatus](#TransactionStatus) | [.TransactionStatus](#TransactionStatus) stream |  |

 



<a name="user.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## user.proto



<a name=".CardData"></a>

### CardData



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;id&#34; |
| department_id | [int32](#int32) |  | database name:&#34;department&#34; |
| card_number | [int32](#int32) |  | database name:&#34;card&#34; |
| account | [string](#string) |  | database name:&#34;account&#34; |
| account_number | [int32](#int32) |  | database name:&#34;numeric_account&#34; |
| name | [string](#string) |  | database name:&#34;name&#34; |
| is_active | [bool](#bool) |  | database name:&#34;is_active&#34; |
| with_department | [bool](#bool) |  |  |
| department_data | [TimesheetDepartment](#TimesheetDepartment) |  |  |
| with_user | [bool](#bool) |  |  |
| user | [User](#User) |  |  |






<a name=".CardDataList"></a>

### CardDataList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [CardData](#CardData) | repeated |  |






<a name=".User"></a>

### User



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;user_id&#34; |
| firstname | [string](#string) |  | database name:&#34;user_firstname&#34;  |
| lastname | [string](#string) |  | database name:&#34;user_lastname&#34;  |
| businessname | [string](#string) |  | database name:&#34;user_businessname&#34;  |
| city | [string](#string) |  | database name:&#34;user_city&#34;  |
| state | [string](#string) |  | database name:&#34;user_state&#34;  |
| zip | [string](#string) |  | database name:&#34;user_zip&#34;  |
| address | [string](#string) |  | database name:&#34;user_address&#34;  |
| phone | [string](#string) |  | database name:&#34;user_phone&#34;  |
| altphone | [string](#string) |  | database name:&#34;user_altphone&#34;  |
| cellphone | [string](#string) |  | database name:&#34;user_cellphone&#34;  |
| fax | [string](#string) |  | database name:&#34;user_fax&#34;  |
| email | [string](#string) |  | database name:&#34;user_email&#34;  |
| alt_email | [string](#string) |  | database name:&#34;user_alt_email&#34;  |
| phone_email | [string](#string) |  | database name:&#34;user_phone_email&#34;  |
| preferred_contact | [string](#string) |  | database name:&#34;user_preferredContact&#34;  |
| receiveemail | [int32](#int32) |  | database name:&#34;user_receiveemail&#34;  |
| date_created | [string](#string) |  | database name:&#34;user_date_created&#34;  |
| last_login | [string](#string) |  | database name:&#34;user_last_login&#34;  |
| annual_hours_pto | [double](#double) |  | database name:&#34;annual_hours_pto&#34;  |
| bonus_hours_pto | [double](#double) |  | database name:&#34;bonus_hours_pto&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;user_isActive&#34;  |
| is_SU | [int32](#int32) |  | database name:&#34;user_isSU&#34;  |
| is_admin | [int32](#int32) |  | database name:&#34;user_isAdmin&#34;  |
| is_office_staff | [int32](#int32) |  | database name:&#34;is_office_staff&#34;  |
| office_group | [int32](#int32) |  | database name:&#34;user_office_group&#34;  |
| is_hvac_tech | [int32](#int32) |  | database name:&#34;is_hvac_tech&#34;  |
| tech_assist | [int32](#int32) |  | database name:&#34;tech_assist&#34;  |
| calendar_pref | [string](#string) |  | database name:&#34;user_calendarPref&#34;  |
| multi_property | [int32](#int32) |  | database name:&#34;user_multiProperty&#34;  |
| is_employee | [int32](#int32) |  | database name:&#34;user_isEmployee&#34;  |
| employee_function_id | [int32](#int32) |  | database name:&#34;employee_function_id&#34;  |
| employee_department_id | [int32](#int32) |  | database name:&#34;employee_department_id&#34;  |
| login | [string](#string) |  | database name:&#34;user_login&#34;  |
| pwd | [string](#string) |  | database name:&#34;user_pwd&#34;  |
| notes | [string](#string) |  | database name:&#34;user_notes&#34;  |
| int_notes | [string](#string) |  | database name:&#34;user_intNotes&#34;  |
| notification | [string](#string) |  | database name:&#34;user_notification&#34;  |
| billing_terms | [string](#string) |  | database name:&#34;user_billingTerms&#34;  |
| rebate | [int32](#int32) |  | database name:&#34;user_rebate&#34;  |
| discount | [int32](#int32) |  | database name:&#34;user_discount&#34;  |
| managed_by | [int32](#int32) |  | database name:&#34;user_managed_by&#34;  |
| current_status | [string](#string) |  | database name:&#34;current_status&#34;  |
| current_status_job_number | [string](#string) |  | database name:&#34;current_status_jobNumber&#34;  |
| current_status_timestamp | [string](#string) |  | database name:&#34;current_status_timestamp&#34;  |
| emp_title | [string](#string) |  | database name:&#34;emp_title&#34;  |
| ext | [string](#string) |  | database name:&#34;ext&#34;  |
| image | [string](#string) |  | database name:&#34;image&#34;  |
| service_calls | [int32](#int32) |  | database name:&#34;user_serviceCalls&#34;  |
| show_billing | [int32](#int32) |  | database name:&#34;user_show_billing&#34;  |
| paid_service_call_status | [int32](#int32) |  | database name:&#34;paid_service_call_status&#34;  |
| is_color_mute | [int32](#int32) |  | database name:&#34;is_color_mute&#34;  |
| service_call_refresh | [int32](#int32) |  | database name:&#34;service_call_refresh&#34;  |
| tool_fund | [double](#double) |  | database name:&#34;tool_fund&#34;  |
| spiff_fund | [double](#double) |  | database name:&#34;spiff_fund&#34;  |
| geolocation_lat | [double](#double) |  | database name:&#34;geolocation_lat&#34;  |
| geolocation_lng | [double](#double) |  | database name:&#34;geolocation_lng&#34;  |
| timesheet_administration | [bool](#bool) |  | database name:&#34;user_timesheet_administration&#34; |
| services_rendered | [ServicesRendered](#ServicesRendered) |  | foreign_key:&#34;technician_user_id&#34; foreign_table:&#34;services_rendered&#34; local_name:&#34;user_id&#34; |
| property | [Property](#Property) |  | foreign_key:&#34;user_id&#34; foreign_table:&#34;properties&#34; local_name:&#34;user_id&#34; |
| properties | [Property](#Property) | repeated |  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |
| order_by | [string](#string) |  |  |
| order_dir | [string](#string) |  |  |
| with_properties | [bool](#bool) |  |  |
| override_limit | [bool](#bool) |  |  |






<a name=".UserList"></a>

### UserList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [User](#User) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".UserService"></a>

### UserService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.User](#User) | [.User](#User) |  |
| Get | [.User](#User) | [.User](#User) |  |
| BatchGet | [.User](#User) | [.UserList](#UserList) |  |
| List | [.User](#User) | [.User](#User) stream |  |
| Update | [.User](#User) | [.User](#User) |  |
| Delete | [.User](#User) | [.User](#User) |  |
| GetCardList | [.CardData](#CardData) | [.CardDataList](#CardDataList) |  |

 



<a name="user_group_link.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## user_group_link.proto



<a name=".UserGroupLink"></a>

### UserGroupLink



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;ugl_id&#34; |
| user_id | [int32](#int32) |  | database name:&#34;user_id&#34;  |
| group_id | [int32](#int32) |  | database name:&#34;group_id&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".UserGroupLinkList"></a>

### UserGroupLinkList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [UserGroupLink](#UserGroupLink) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".UserGroupLinkService"></a>

### UserGroupLinkService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.UserGroupLink](#UserGroupLink) | [.UserGroupLink](#UserGroupLink) |  |
| Get | [.UserGroupLink](#UserGroupLink) | [.UserGroupLink](#UserGroupLink) |  |
| BatchGet | [.UserGroupLink](#UserGroupLink) | [.UserGroupLinkList](#UserGroupLinkList) |  |
| List | [.UserGroupLink](#UserGroupLink) | [.UserGroupLink](#UserGroupLink) stream |  |
| Update | [.UserGroupLink](#UserGroupLink) | [.UserGroupLink](#UserGroupLink) |  |
| Delete | [.UserGroupLink](#UserGroupLink) | [.UserGroupLink](#UserGroupLink) |  |

 



<a name="vendor.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## vendor.proto



<a name=".Vendor"></a>

### Vendor



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;vendor_id&#34; |
| firstname | [string](#string) |  | database name:&#34;vendor_firstname&#34;  |
| lastname | [string](#string) |  | database name:&#34;vendor_lastname&#34;  |
| businessname | [string](#string) |  | database name:&#34;vendor_businessname&#34;  |
| city | [string](#string) |  | database name:&#34;vendor_city&#34;  |
| state | [string](#string) |  | database name:&#34;vendor_state&#34;  |
| zip | [string](#string) |  | database name:&#34;vendor_zip&#34;  |
| address | [string](#string) |  | database name:&#34;vendor_address&#34;  |
| phone | [string](#string) |  | database name:&#34;vendor_phone&#34;  |
| altphone | [string](#string) |  | database name:&#34;vendor_altphone&#34;  |
| cellphone | [string](#string) |  | database name:&#34;vendor_cellphone&#34;  |
| email | [string](#string) |  | database name:&#34;vendor_email&#34;  |
| alt_email | [string](#string) |  | database name:&#34;vendor_alt_email&#34;  |
| receiveemail | [int32](#int32) |  | database name:&#34;vendor_receiveemail&#34; |
| date_created | [string](#string) |  | database name:&#34;vendor_date_created&#34;  |
| is_active | [int32](#int32) |  | database name:&#34;vendor_isActive&#34; |
| fax | [string](#string) |  | database name:&#34;vendor_fax&#34;  |
| managed_by | [int32](#int32) |  | database name:&#34;vendor_managed_by&#34;  |
| auth_token | [string](#string) |  | database name:&#34;AuthToken&#34;  |
| geolocation_lat | [double](#double) |  | database name:&#34;geolocation_lat&#34;  |
| geolocation_lng | [double](#double) |  | database name:&#34;geolocation_lng&#34;  |
| user_office_group | [int32](#int32) |  | database name:&#34;user_office_group&#34;  |
| title | [string](#string) |  | database name:&#34;vendor_title&#34;  |
| ext | [string](#string) |  | database name:&#34;ext&#34;  |
| image | [string](#string) |  | database name:&#34;image&#34;  |
| include_in_pdf | [int32](#int32) |  | database name:&#34;include_in_pdf&#34;  |
| badge_id | [string](#string) |  | database name:&#34;vendor_badge_id&#34;  |
| user_is_confirmed | [int32](#int32) |  | database name:&#34;user_isConfirmed&#34;  |
| type | [string](#string) |  | database name:&#34;vendor_type&#34;  |
| notes | [string](#string) |  | database name:&#34;vendor_notes&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".VendorList"></a>

### VendorList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [Vendor](#Vendor) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".VendorService"></a>

### VendorService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.Vendor](#Vendor) | [.Vendor](#Vendor) |  |
| Get | [.Vendor](#Vendor) | [.Vendor](#Vendor) |  |
| BatchGet | [.Vendor](#Vendor) | [.VendorList](#VendorList) |  |
| List | [.Vendor](#Vendor) | [.Vendor](#Vendor) stream |  |
| Update | [.Vendor](#Vendor) | [.Vendor](#Vendor) |  |
| Delete | [.Vendor](#Vendor) | [.Vendor](#Vendor) |  |

 



<a name="vendor_order.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## vendor_order.proto



<a name=".VendorOrder"></a>

### VendorOrder



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  | database name:&#34;order_id&#34; |
| vendor_id | [int32](#int32) |  | database name:&#34;vendor_id&#34;  |
| quote_part_id | [int32](#int32) |  | database name:&#34;quote_part_id&#34;  |
| reference | [string](#string) |  | database name:&#34;vendor_order_reference&#34;  |
| order_status | [int32](#int32) |  | database name:&#34;order_status&#34;  |
| order_date | [string](#string) |  | database name:&#34;order_date&#34;  |
| order_eta | [string](#string) |  | database name:&#34;order_eta&#34;  |
| field_mask | [string](#string) | repeated |  |
| page_number | [int32](#int32) |  |  |






<a name=".VendorOrderList"></a>

### VendorOrderList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [VendorOrder](#VendorOrder) | repeated |  |
| total_count | [int32](#int32) |  |  |





 

 

 


<a name=".VendorOrderService"></a>

### VendorOrderService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [.VendorOrder](#VendorOrder) | [.VendorOrder](#VendorOrder) |  |
| Get | [.VendorOrder](#VendorOrder) | [.VendorOrder](#VendorOrder) |  |
| BatchGet | [.VendorOrder](#VendorOrder) | [.VendorOrderList](#VendorOrderList) |  |
| List | [.VendorOrder](#VendorOrder) | [.VendorOrder](#VendorOrder) stream |  |
| Update | [.VendorOrder](#VendorOrder) | [.VendorOrder](#VendorOrder) |  |
| Delete | [.VendorOrder](#VendorOrder) | [.VendorOrder](#VendorOrder) |  |

 



## Scalar Value Types

| .proto Type | Notes | C++ | Java | Python | Go | C# | PHP | Ruby |
| ----------- | ----- | --- | ---- | ------ | -- | -- | --- | ---- |
| <a name="double" /> double |  | double | double | float | float64 | double | float | Float |
| <a name="float" /> float |  | float | float | float | float32 | float | float | Float |
| <a name="int32" /> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="int64" /> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="uint32" /> uint32 | Uses variable-length encoding. | uint32 | int | int/long | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="uint64" /> uint64 | Uses variable-length encoding. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum or Fixnum (as required) |
| <a name="sint32" /> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sint64" /> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="fixed32" /> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="fixed64" /> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum |
| <a name="sfixed32" /> sfixed32 | Always four bytes. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sfixed64" /> sfixed64 | Always eight bytes. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="bool" /> bool |  | bool | boolean | boolean | bool | bool | boolean | TrueClass/FalseClass |
| <a name="string" /> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode | string | string | string | String (UTF-8) |
| <a name="bytes" /> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str | []byte | ByteString | string | String (ASCII-8BIT) |

