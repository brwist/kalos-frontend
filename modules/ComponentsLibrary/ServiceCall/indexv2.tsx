import React, {
  FC,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from 'react';
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
} from '../../../helpers';
import { ENDPOINT, OPTION_BLANK } from '../../../constants';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { Tabs } from '../Tabs';
import { Option } from '../Field';
import { Form, Schema } from '../Form';
import { SpiffApplyComponent } from '../SpiffApplyComponent';
import { Request } from './components/Request';
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
import { ServiceCallLogs } from '../ServiceCallLogs';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import DragIndicatorTwoTone from '@material-ui/icons/DragIndicatorTwoTone';
import ExpandMoreTwoTone from '@material-ui/icons/ExpandMoreTwoTone';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import { ContractInfo } from '../../CustomerDetails/components/ContractInfo';
import { ContractFrequency } from '@kalos-core/kalos-rpc/ContractFrequency';

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
    serviceCallId: props.serviceCallId ? props.serviceCallId : 0,
    entry: new Event(),
    property: new Property(),
    customer: new User(),
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
    cardSortOrder: ["request", "serviceItems", "services", "proposals"],
  }

  const [state, updateServiceCallState] = useReducer(reducer, initialState);

  const loadServicesRenderedData = useCallback(
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

  const load = useCallback(async() => {
    let entry: Event = new Event();
    const property = PropertyClientService.loadPropertyByID(propertyId);
    const customer = UserClientService.loadUserById(userID);
    const propertyEvents =
      EventClientService.loadEventsByPropertyId(propertyId);
    const jobTypes = JobTypeClientService.loadJobTypes();
    const jobSubtypes = JobSubtypeClientService.loadJobSubtypes();
    const jobTypeSubtypes = JobTypeSubtypeClientService.loadJobTypeSubtypes();
    const loggedUser = UserClientService.loadUserById(loggedUserId);
    const servicesRendered = loadServicesRenderedData();
    const frequencies = ContractFrequencyClientService.BatchGet(new ContractFrequency());
    const [
      propertyDetails,
      customerDetails,
      propertyEventDetails,
      jobTypeList,
      jobSubTypeList,
      jobTypeSubtypesList,
      loggedUserDetails,
      servicesRenderedList,
      frequencyTypes,
    ] = await Promise.all([
      property,
      customer,
      propertyEvents,
      jobTypes,
      jobSubtypes,
      jobTypeSubtypes,
      loggedUser,
      servicesRendered,
      frequencies,
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
  
  const handleAccordionToggle = (accordion: string) => (event : React.SyntheticEvent, expanded : boolean) => {
    if (accordion === "custInfo") {
      updateServiceCallState({type: "setShowCustInfo", data: expanded});
    } else if (accordion === "contractInfo") {
      updateServiceCallState({type: "setShowContractInfo", data: expanded});
    }
  }

  useEffect(() => {
    if (eventId !== 0 && !state.loaded) {
      load();
    }
  }, [eventId, state.loaded, load])

  return (
    <SectionBar
      title={"Service Call Details"}
      actions={[
        {
          label: 'Close',
          onClick: onClose
        }
      ]
      }
    >
      <div>
        {state.contract.getId() > 0 && (
          <div>
            <Typography style={{textAlign:"center", paddingTop:"10px", paddingBottom:"10px", fontSize:"20px"}}>
              {`Job Number : ${state.entry.getLogJobNumber()}`}
            </Typography>
            <Accordion disableGutters expanded={state.showContractInfo} onChange={handleAccordionToggle('contractInfo')}>
              <AccordionSummary
                expandIcon={<ExpandMoreTwoTone />}
                style={{backgroundColor:"lightgray"}}
              >
                <Typography>
                  {`Contract # : ${state.entry.getContractNumber()}`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <InfoTable data={
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
                } />
                {/* <InfoTable data={makeFakeRows(2,3)} loading /> */}
              </AccordionDetails>
            </Accordion>
          </div>
        )}
        <Accordion disableGutters expanded={state.showCustInfo} onChange={handleAccordionToggle('custInfo')}>
          <AccordionSummary
            expandIcon={<ExpandMoreTwoTone />}
            aria-controls="custInfo-content"
            id="custInfo"
            style={{backgroundColor:"lightgray"}}
          >
            <Typography>
              {`Customer : ${state.customer.getBusinessname() !== "" ? state.customer.getBusinessname() : state.customer.getFirstname() + " " + state.customer.getLastname()}`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
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
            {/* <InfoTable data={makeFakeRows(2,4)} loading /> */}
          </AccordionDetails>
        </Accordion>
        <DragDropContext onDragEnd={(result)=>{console.log(result)}}>
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
                    key={card}
                    draggableId={`${card}-draggable`}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      switch (card) {
                        case "request":
                          return (
                            <Grid
                              item={true}
                              xs={12}
                              ref={provided.innerRef}
                              style={{paddingTop:"10px", display:"flex"}}
                              {...provided.draggableProps}
                            >
                              <Card raised sx={{backgroundColor:"lightpink", width:"100%"}}>
                                <CardHeader title={<Typography variant="h6" component="div" style={{textAlign:"center"}}>Request</Typography>} {...provided.dragHandleProps} />
                                <CardActionArea>
                                  <CardContent>
                                    <InfoTable data={makeFakeRows(5,8)} loading />
                                  </CardContent>
                                </CardActionArea>
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
                              <Card raised sx={{backgroundColor:"lightcyan", width:"100%"}}>
                                <CardHeader title={<Typography variant="h6" component="div" style={{textAlign:"center"}}>Service Items</Typography>} {...provided.dragHandleProps} />
                                <CardActionArea>
                                  <CardContent>
                                    <InfoTable data={makeFakeRows(7,5)} loading />
                                  </CardContent>
                                </CardActionArea>
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
                              <Card raised sx={{backgroundColor:"lightyellow", width:"100%"}}>
                                <CardHeader title={<Typography variant="h6" component="div" style={{textAlign:"center"}}>Services</Typography>} {...provided.dragHandleProps} />
                                <CardActionArea>
                                  <CardContent>
                                    <InfoTable data={makeFakeRows(5,3)} loading />
                                  </CardContent>
                                </CardActionArea>
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
                              <Card raised sx={{backgroundColor:"lightgreen", width:"100%"}}>
                                <CardHeader title={<Typography variant="h6" component="div" style={{textAlign:"center"}}>Proposals</Typography>} {...provided.dragHandleProps} />
                                <CardActionArea>
                                  <CardContent>
                                    <InfoTable data={makeFakeRows(5,4)} loading />
                                  </CardContent>
                                </CardActionArea>
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
    </SectionBar>
  )
}