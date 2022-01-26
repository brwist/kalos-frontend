import React, {
  FC,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from 'react';
import { Payment } from '@kalos-core/kalos-rpc/Payment';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { JobTypeSubtype } from '@kalos-core/kalos-rpc/JobTypeSubtype';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { Contract } from '@kalos-core/kalos-rpc/Contract';
import {
  getRPCFields,
  makeFakeRows,
  PropertyClientService,
  JobTypeClientService,
  JobSubtypeClientService,
  EventClientService,
  UserClientService,
  cfURL,
  JobTypeSubtypeClientService,
  ServicesRenderedClientService,
  makeSafeFormObject,
  ActivityLogClientService,
  ContractClientService,
  ContractFrequencyClientService,
  TimesheetDepartmentClientService,
} from '../../../helpers';
import { OPTION_BLANK } from '../../../constants';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { Tabs } from '../Tabs';
import { Option } from '../Field';
import { Form, Schema } from '../Form';
import { SpiffApplyComponent } from '../SpiffApplyComponent';
import { Request } from './components/Request';
import { RequestDetails } from './components/RequestDetails';
import { Equipment } from './components/Equipment';
import { Services } from './components/Services';
import { Invoice } from './components/Invoice';
import { Proposal } from './components/Proposal';
import { Spiffs } from './components/Spiffs';
import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';
import format from 'date-fns/esm/format';
import setHours from 'date-fns/esm/setHours';
import setMinutes from 'date-fns/esm/setMinutes';
import parseISO from 'date-fns/esm/parseISO';
import { State, reducer } from './reducerv2';
import Typography from '@mui/material/Typography';
import ExpandMoreTwoTone from '@material-ui/icons/ExpandMoreTwoTone';
import ExpandLessTwoTone from '@material-ui/icons/ExpandLessTwoTone';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import { ContractFrequency } from '@kalos-core/kalos-rpc/ContractFrequency';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HelpOutlineTwoTone from '@material-ui/icons/HelpOutlineTwoTone';
import Edit from '@material-ui/icons/Edit';
import Tooltip from '@mui/material/Tooltip';
import { ServiceItem } from '@kalos-core/kalos-rpc/ServiceItem';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { ButtonGroup } from '@mui/material';
import { ServiceItems } from '../ServiceItems';
import { ServiceCallReadings } from '../ServiceCallReadings';


export interface Props {
  userID: number;
  propertyId: number;
  serviceCallId?: number;
  loggedUserId: number;
  onClose?: () => void;
  onSave?: () => void;
}

export const ServiceCallNew: FC<Props> = props => {
  const {
    userID,
    propertyId,
    serviceCallId: eventId,
    loggedUserId,
    onClose,
    onSave,
  } = props;

  const initialState: State = {
    userList: [],
    requestFields: [],
    departmentList: [],
    serviceCallId: props.serviceCallId ? props.serviceCallId : 0,
    entry: new Event(),
    property: new Property(),
    customer: new User(),
    paidServices: [],
    propertyEvents: [],
    contract: new Contract,
    contractFrequencyTypes: [],
    loaded: false,
    loading: true,
    saving: false,
    jobTypes: [],
    jobSubtypes: [],
    jobTypeSubtypes: [],
    servicesRendered: [],
    loggedUser: new User(),
    openModal: false,
    modalType: '',
    showContractInfo: false,
    showCustInfo: false,
    showPropertyInfo: false,
    cardSortOrder: [{name: "request", display: true}, {name: "serviceItems", display: true}, {name: "services", display: true}, {name: "invoices", display: true}, {name: "proposals", display: true}],
    showRequest: true,
    showServiceItems: true,
    showServices: true,
    showProposals: true,
    selectedServiceItems: [],
    pendingSave: false,
  }

  const [state, updateServiceCallState] = useReducer(reducer, initialState);

  const requestRef = useRef(null);

  const loadEntry = useCallback(
    async (_serviceCallId = state.serviceCallId) => {
      if (_serviceCallId) {
        const req = new Event();
        req.setId(_serviceCallId);
        const entry = await EventClientService.Get(req);
        updateServiceCallState({ type: 'setEntry', data: entry });
      }
    },
    [state.serviceCallId],
  );

  const setSelectedServiceItems = (data: ServiceItem[]) => {
    updateServiceCallState({
      type: 'setSelectedServiceItems',
      data: data,
    });
  };

  const handleUpdatePayments = (payments: Payment[]) => {
    updateServiceCallState({
      type: 'setPaidServices',
      data: payments,
    });
  };

  const handleOnAddMaterials = useCallback(
    async (materialUsed, materialTotal) => {
      await EventClientService.updateMaterialUsed(
        state.serviceCallId,
        materialUsed + state.entry.getMaterialUsed(),
        materialTotal + state.entry.getMaterialTotal(),
      );
      await loadEntry();
    },
    [state.serviceCallId, state.entry, loadEntry],
  );

  const handleSetRequestfields = useCallback(
    fields => {
      updateServiceCallState({
        type: 'setRequestFields',
        data: [...state.requestFields, ...fields],
      });
    },
    [state.requestFields],
  );

  const handleChangeEntry = useCallback((data: Event) => {
    updateServiceCallState({
      type: 'setChangeEntry',
      data: {
        entry: data,
        pendingSave: false,
      },
    });
  }, []);

  const jobTypeOptions: Option[] = state.jobTypes.map(id => ({
    label: id.getName(),
    value: id.getId(),
  }));

  const jobSubtypeOptions: Option[] = [
    { label: OPTION_BLANK, value: 0 },
    ...state.jobTypeSubtypes
      .filter(
        jobTypeId => jobTypeId.getJobTypeId() === state.entry.getJobTypeId(),
      )
      .map(jobSubtypeId => ({
        value: jobSubtypeId.getJobSubtypeId(),
        label:
          state.jobSubtypes
            .find(id => id.getId() === jobSubtypeId.getJobSubtypeId())
            ?.getName() || '',
      })),
  ];

  const handleCloseModal = () => {
    if (state.modalType === "request") {
      // update form for editted data
    }
    updateServiceCallState({type:'setModalType', data: ""});
  }

  const loadServicesRenderedDataForProp = useCallback(
    async (_serviceCallId = state.serviceCallId) => {
      if (_serviceCallId) {
        updateServiceCallState({ type: 'setLoading', data: true });
        const req = new ServicesRendered();
        req.setIsActive(1);
        req.setEventId(_serviceCallId);
        const servicesRendered = (
          await ServicesRenderedClientService.BatchGet(req)
        ).getResultsList();

        updateServiceCallState({
          type: 'setServicesRendered',
          data: { servicesRendered: servicesRendered, loading: false },
        });

        console.log(servicesRendered);
        console.log('we are here getting sr data');
      } else {
        updateServiceCallState({ type: 'setLoading', data: false });
      }
    },
    [state.serviceCallId],
  );

  const loadServicesRenderedData = useCallback(
    async (_serviceCallId = state.serviceCallId) => {
      if (_serviceCallId) {
        // updateServiceCallState({ type: 'setLoading', data: true });
        const req = new ServicesRendered();
        req.setIsActive(1);
        req.setEventId(_serviceCallId);
        const servicesRendered = (
          await ServicesRenderedClientService.BatchGet(req)
        ).getResultsList();
        updateServiceCallState({
          type: 'setServicesRendered',
          data: { servicesRendered: servicesRendered, loading: true },
        });
        console.log(servicesRendered);
        console.log('we are here getting sr data');
        return servicesRendered;
      } else {
        return [];
      }
    },
    [state.serviceCallId],
  );

  const handleCardOrderUpdate = (name: string, oldIndex: number, newIndex: number, display: boolean) => {
    const cards = state.cardSortOrder;
    if (oldIndex !== newIndex) {
      cards.splice(newIndex, 0, cards.splice(oldIndex, 1)[0]);
    }
    if (cards[newIndex].name === name) {
      if (cards[newIndex].display !== display) {
        cards[newIndex].display = display;
      }
    }
    updateServiceCallState({type: "setCardSortOrder", data: cards});
  }

  const load = useCallback(async() => {
    let entry: Event = new Event();
    const user = new User();
    user.setIsActive(1);
    user.setIsEmployee(1);
    user.setOverrideLimit(true);
    const department = new TimesheetDepartment();
    department.setIsActive(1);
    const users = UserClientService.BatchGet(user);
    const departments = TimesheetDepartmentClientService.BatchGet(department);
    const property = PropertyClientService.loadPropertyByID(propertyId);
    const customer = UserClientService.loadUserById(userID);
    const propertyEvents =
      EventClientService.loadEventsByPropertyId(propertyId);
    const jobTypes = JobTypeClientService.loadJobTypes();
    const jobSubtypes = JobSubtypeClientService.loadJobSubtypes();
    const jobTypeSubtypes = JobTypeSubtypeClientService.loadJobTypeSubtypes();
    const loggedUser = UserClientService.loadUserById(loggedUserId);
    const servicesRendered = loadServicesRenderedData();
    const frequencyTypes = await ContractFrequencyClientService.BatchGet(new ContractFrequency());
    const [
      userList,
      departmentList,
      propertyDetails,
      customerDetails,
      propertyEventDetails,
      jobTypeList,
      jobSubTypeList,
      jobTypeSubtypesList,
      loggedUserDetails,
      servicesRenderedList,
      // frequencyTypes,
    ] = await Promise.all([
      users,
      departments,
      property,
      customer,
      propertyEvents,
      jobTypes,
      jobSubtypes,
      jobTypeSubtypes,
      loggedUser,
      servicesRendered,
      // frequencies,
    ]);
    if (state.serviceCallId) {
      const req = new Event();
      req.setId(state.serviceCallId);
      entry = await EventClientService.Get(req);
    } else {
      const req = new Event();
      req.setIsResidential(1);
      req.setDateStarted(format(new Date(), 'yyyy-MM-dd'));
      req.setDateEnded(format(new Date(), 'yyyy-MM-dd'));
      req.setTimeStarted(
        format(setMinutes(setHours(new Date(), 8), 0), 'HH:mm'),
      );
      req.setTimeEnded(
        format(setMinutes(setHours(new Date(), 18), 0), 'HH:mm'),
      );

      req.setName(
        `${propertyDetails.getAddress()} ${propertyDetails.getCity()}, ${propertyDetails.getState()} ${propertyDetails.getZip()}`,
      );
      entry = req;
    }
    let contractInfo = new Contract();
    if (entry.getContractId()) {
      const req = new Contract();
      req.setId(entry.getContractId());
      contractInfo = await ContractClientService.Get(req);
    }
    updateServiceCallState({
      type: 'setData',
      data: {
        userList: userList.getResultsList(),
        departmentList: departmentList.getResultsList(),
        property: propertyDetails,
        customer: customerDetails,
        propertyEvents: propertyEventDetails,
        jobTypes: jobTypeList,
        jobSubtypes: jobSubTypeList,
        jobTypeSubtypes: jobTypeSubtypesList,
        loggedUser: loggedUserDetails,
        entry: entry,
        servicesRendered: servicesRenderedList,
        loaded: true,
        loading: false,
        contractInfo: contractInfo,
        frequencyTypes: frequencyTypes.getResultsList(),
      },
    });    
  }, [loadServicesRenderedData, loggedUserId, propertyId, state.serviceCallId, userID])
  
  const handleTooltipToggle = (tooltip: string) => {
    if (tooltip === "custInfo") {
      updateServiceCallState({type: "setShowCustInfo", data: !state.showCustInfo});
    } else if (tooltip === "contractInfo") {
      updateServiceCallState({type: "setShowContractInfo", data: !state.showContractInfo});
    }
  }

  useEffect(() => {
    console.log("Rendering");
    if (eventId !== 0 && !state.loaded) {
      load();
    }
    if (state.pendingSave && requestRef.current) {
      //@ts-ignore
      requestRef.current.click();
    }
  }, [eventId, state.loaded, load, state.pendingSave])

  return (
    <SectionBar
      title={`Service Call Details - ${state.entry.getLogJobNumber()}`}
      styles={{zIndex:4}}
      actions={[
        {
          label: 'Close',
          onClick: onClose
        }
      ]
      }
    >
      <div style={{paddingTop:"10px"}}>
        <Grid container style={{width:"98%"}}>
          <Grid item xs={6} md={4} style={{margin:"auto"}}>
            <div style={{display:"flex"}}>
              <div style={{margin:"auto", marginRight:"0px"}}>
                <Typography style={{fontWeight:"bolder", fontSize:"20px"}}>
                  {`Customer`}
                </Typography>
                <Typography style={{fontSize:"18px"}}>
                  {`${state.customer.getBusinessname() !== "" ? state.customer.getBusinessname() : state.customer.getFirstname() + " " + state.customer.getLastname()}`}
                </Typography>
              </div>
              <Tooltip 
                arrow 
                style={{marginRight:"25%"}}
                open={state.showCustInfo}
                placement="bottom" 
                title={
                <InfoTable data={
                  [
                    [
                      { label: 'Primary Phone', value: state.customer.getPhone(), href: 'tel' },
                      { label: 'Alternate Phone', value: state.customer.getAltphone(), href: 'tel' },
                    ],
                    [
                      { label: 'Cell Phone', value: state.customer.getCellphone(), href: 'tel' },
                      { label: 'Fax', value: state.customer.getFax(), href: 'tel' },
                    ],
                    [
                      { label: 'Billing Terms', value: state.customer.getBillingTerms() },
                      { label: 'Email', value: state.customer.getEmail(), href: 'mailto' },
                    ],
                    [
                      { label: 'Property', value: state.property.getAddress() },
                      { label: 'City, State, Zip', value: `${state.property.getCity()}, ${state.property.getState()} ${state.property.getZip()}` },
                    ],
                  ]
                }
                />
              }>
                <IconButton onClick={()=>{handleTooltipToggle("custInfo")}}>
                  <HelpOutlineTwoTone style={{fontSize:"medium"}} />
                </IconButton>
              </Tooltip>
            </div>
          </Grid>
          <Grid item xs={6} md={4} style={{margin:"auto"}}>
            {state.contract.getId() > 0 && (
              <div style={{display:"flex"}}>
                <div style={{margin:"auto", marginRight:"0px"}}>
                  <Typography style={{fontWeight:"bolder", fontSize:"20px"}}>
                    {`Contract #`}
                  </Typography>
                  <Typography style={{fontSize:"18px"}}>
                    {`${state.entry.getContractNumber()}`}
                  </Typography>
                </div>
                <Tooltip 
                  arrow 
                  style={{marginRight:"25%"}}
                  placement="bottom-start" 
                  open={state.showContractInfo}
                  title={
                  <InfoTable styles={{width:"100%"}} data={
                    [
                      [
                        { label: 'Start Date', value: format(parseISO(state.contract.getDateStarted()), 'MM/dd/yyyy h:mm aa') },
                        { label: 'End Date', value: format(parseISO(state.contract.getDateEnded()), 'MM/dd/yyyy h:mm aa') },
                      ],
                      [
                        { label: 'Payment Type', value: state.contract.getPaymentType() },
                        { label: 'Payment Status', value: state.contract.getPaymentStatus() },
                      ],
                      [
                        { label: 'Frequency', value: state.contractFrequencyTypes.find(type => type.getId() === state.contract.getFrequency())?.getName() },
                        { label: 'Billing', value: state.contract.getGroupBilling() === 1 ? 'Group' : 'Site' },
                      ],
                      [
                        { label: 'Payment Terms', value: state.contract.getPaymentTerms() },
                      ],
                    ]
                  }/>
                }>
                  <IconButton onClick={()=>{handleTooltipToggle("contractInfo")}}>
                    <HelpOutlineTwoTone style={{fontSize:"medium"}} />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid sx={{display:{xs:"flex", md:"grid"}, paddingLeft:{xs:"2%", md:"0"}, paddingTop:{xs:"10px", md:"0"}}}>
              <Button
                sx={{backgroundColor:"#990a26", color:"white"}}
                fullWidth
                onClick={()=>{updateServiceCallState({type:'setModalType', data: "equipment"})}}
              >
                View Equipment
              </Button>
              <Button
                sx={{backgroundColor:"#990a26", color:"white"}}
                fullWidth
                onClick={()=>{updateServiceCallState({type:'setModalType', data: "spiffs"})}}
              >
                View Spiffs
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <DragDropContext onDragEnd={(result)=>{
          console.log(result);
          if (result.destination && result.source.index !== result.destination.index) {
            handleCardOrderUpdate(state.cardSortOrder[result.source.index].name, result.source.index, result.destination.index, state.cardSortOrder[result.source.index].display);
          }
        }}>
          <Droppable
            droppableId="card-droppable"
          >
            {(provided, snapshot) => (
              <Grid 
                ref={provided.innerRef}
                container 
                style={{width:"98%", margin:"auto", paddingTop:"10px"}}
                {...provided.droppableProps}
              >
                {state.cardSortOrder.map((card, index) => (
                  <Draggable 
                    key={card.name}
                    draggableId={`${card.name}-draggable`}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      switch (card.name) {
                        case "request":
                          return (
                            <Grid
                              item={true}
                              xs={12}
                              ref={provided.innerRef}
                              style={{paddingTop:"10px", display:"flex"}}
                              {...provided.draggableProps}
                            >
                              <Card raised sx={{width:"100%"}}>
                                <CardHeader 
                                  style={{backgroundColor:"#990a26", color:"white", height:"20px"}}
                                  title={<Typography variant="h6" component="div" style={{textAlign:"center"}}>Request</Typography>}
                                  action={<IconButton onClick={()=>{updateServiceCallState({type:'setModalType', data: "request"})}}><Edit style={{color:"white", margin:"auto", fontSize:"medium"}} /></IconButton>}
                                  {...provided.dragHandleProps} 
                                />
                                <Collapse in={card.display}>
                                  <CardContent>
                                    <RequestDetails
                                      requestInfo={state.entry}
                                      userList={state.userList}
                                      departmentList={state.departmentList}
                                      propertyEvents={state.propertyEvents}
                                    />
                                    {/* <InfoTable data={makeFakeRows(5,8)} loading /> */}
                                  </CardContent>
                                </Collapse>
                                <Button style={{width:"100%", height:"30px", display:"block", margin:"auto", backgroundColor:"lightgray"}} onClick={()=>{handleCardOrderUpdate(card.name, index, index, !card.display)}}>
                                  {card.display ? <ExpandLessTwoTone /> : <ExpandMoreTwoTone />}
                                </Button>
                              </Card>
                              <Grid item xs={12} style={{height:"10px"}} />
                            </Grid>
                          )
                        case "serviceItems":
                          return (
                            <Grid
                              item={true}
                              xs={12}
                              ref={provided.innerRef}
                              style={{paddingTop:"10px", display:"flex"}}
                              {...provided.draggableProps}
                            >
                              <Card raised sx={{width:"100%"}}>
                                <CardHeader
                                  style={{backgroundColor:"#990a26", color:"white", height:"20px"}}
                                  title={<Typography variant="h6" component="div" style={{textAlign:"center"}}>Service Items</Typography>}
                                  {...provided.dragHandleProps} 
                                />
                                <Collapse in={card.display}>
                                  <CardContent>
                                    {/* <Equipment
                                      {...props}
                                      event={state.entry}
                                      customer={state.customer}
                                      property={state.property}
                                      onSelectServiceItems={
                                        state.loggedUser.getIsEmployee()
                                          ? setSelectedServiceItems
                                          : undefined
                                      }
                                      selectedServiceItems={state.selectedServiceItems}
                                    /> */}
                                    <ServiceCallReadings
                                      loggedUserId={loggedUserId}
                                      propertyId={state.property.getId()}
                                      eventId={state.entry.getId()}
                                    />
                                    {/* <InfoTable data={makeFakeRows(7,5)} loading /> */}
                                  </CardContent>
                                </Collapse>
                                <Button style={{width:"100%", height:"30px", display:"block", margin:"auto", backgroundColor:"lightgray"}} onClick={()=>{handleCardOrderUpdate(card.name, index, index, !card.display)}}>
                                  {card.display ? <ExpandLessTwoTone /> : <ExpandMoreTwoTone />}
                                </Button>
                              </Card>
                              <Grid item xs={12} style={{height:"10px"}} />
                            </Grid>
                          )
                        case "services":
                          return (
                            <Grid
                              item={true}
                              xs={12}
                              ref={provided.innerRef}
                              style={{paddingTop:"10px", display:"flex"}}
                              {...provided.draggableProps}
                            >
                              <Card raised sx={{width:"100%"}}>
                                <CardHeader
                                  style={{backgroundColor:"#990a26", color:"white", height:"20px"}}
                                  title={<Typography variant="h6" component="div" style={{textAlign:"center"}}>Services</Typography>}
                                  {...provided.dragHandleProps}
                                />
                                <Collapse in={card.display}>
                                  <CardContent>
                                    <Services
                                      serviceCallId={state.serviceCallId}
                                      servicesRendered={state.servicesRendered}
                                      loggedUser={state.loggedUser}
                                      loadServicesRendered={loadServicesRenderedDataForProp}
                                      loading={state.loading}
                                      payments={state.paidServices}
                                      onUpdatePayments={handleUpdatePayments}
                                      onAddMaterials={handleOnAddMaterials}
                                    />
                                    {/* <InfoTable data={makeFakeRows(5,3)} loading /> */}
                                  </CardContent>
                                </Collapse>
                                <Button style={{width:"100%", height:"30px", display:"block", margin:"auto", backgroundColor:"lightgray"}} onClick={()=>{handleCardOrderUpdate(card.name, index, index, !card.display)}}>
                                  {card.display ? <ExpandLessTwoTone /> : <ExpandMoreTwoTone />}
                                </Button>
                              </Card>
                              <Grid item xs={12} style={{height:"10px"}} />
                            </Grid>
                          )
                        case "invoices":
                          return (
                            <Grid
                              item={true}
                              xs={12}
                              ref={provided.innerRef}
                              style={{paddingTop:"10px", display:"flex"}}
                              {...provided.draggableProps}
                            >
                              <Card raised sx={{width:"100%"}}>
                                <CardHeader
                                  style={{backgroundColor:"#990a26", color:"white", height:"20px"}}
                                  title={<Typography variant="h6" component="div" style={{textAlign:"center"}}>Invoices</Typography>}
                                  action={<IconButton><Edit style={{color:"white", margin:"auto", fontSize:"medium"}} /></IconButton>}
                                  {...provided.dragHandleProps}
                                />
                                <Collapse in={card.display}>
                                  <CardContent>
                                    <InfoTable data={makeFakeRows(5,4)} loading />
                                  </CardContent>
                                </Collapse>
                                <Button style={{width:"100%", height:"30px", display:"block", margin:"auto", backgroundColor:"lightgray"}} onClick={()=>{handleCardOrderUpdate(card.name, index, index, !card.display)}}>
                                  {card.display ? <ExpandLessTwoTone /> : <ExpandMoreTwoTone />}
                                </Button>
                              </Card>
                              <Grid item xs={12} style={{height:"10px"}} />
                            </Grid>
                          )
                        case "proposals":
                          return (
                            <Grid
                              item={true}
                              xs={12}
                              ref={provided.innerRef}
                              style={{paddingTop:"10px", display:"flex"}}
                              {...provided.draggableProps}
                            >
                              <Card raised sx={{width:"100%"}}>
                                <CardHeader
                                  style={{backgroundColor:"#990a26", color:"white", height:"20px"}}
                                  title={<Typography variant="h6" component="div" style={{textAlign:"center"}}>Proposals</Typography>}
                                  {...provided.dragHandleProps}
                                />
                                <Collapse in={card.display}>
                                  <CardContent>
                                    {/* <Proposal
                                      serviceItem={state.entry}
                                      customer={state.customer}
                                      property={state.property}
                                    /> */}
                                    {/* <InfoTable data={makeFakeRows(5,4)} loading /> */}
                                  </CardContent>
                                </Collapse>
                                <Button style={{width:"100%", height:"100%", display:"block", margin:"auto", backgroundColor:"lightgray"}} onClick={()=>{handleCardOrderUpdate(card.name, index, index, !card.display)}}>
                                  {card.display ? <ExpandLessTwoTone /> : <ExpandMoreTwoTone />}
                                </Button>
                              </Card>
                              <Grid item xs={12} style={{height:"10px"}} />
                            </Grid>
                          )
                        default :
                          return (<div/>)
                      }
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <Modal
        open={state.modalType !== ""}
        onClose={()=>{handleCloseModal()}}
      >
        {state.modalType === "request" && (
          <SectionBar
            title="Edit Request"
            actions={[{label: "Close", onClick:()=>{handleCloseModal()}}]}
          >
            <Request
              key={state.loading.toString()}
              // @ts-ignore
              ref={requestRef}
              serviceItem={state.entry}
              propertyEvents={state.propertyEvents}
              loading={state.loading}
              jobTypeOptions={jobTypeOptions}
              jobSubtypeOptions={jobSubtypeOptions}
              onChange={handleChangeEntry}
              disabled={state.saving}
              onValid={data => {
                updateServiceCallState({
                  type: 'setRequestValid',
                  data: data,
                });
              }}
              onInitSchema={handleSetRequestfields}
            />
          </SectionBar>
        )}
        {state.modalType === "equipment" && (
          <ServiceItems
            loggedUserId={loggedUserId}
            userID={userID}
            propertyId={state.property.getId()}
            // eventId={state.entry.getId()}
          />
        )}
      </Modal>
    </SectionBar>
  )
}