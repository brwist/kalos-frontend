import { DispatchableTech, DispatchCall } from "@kalos-core/kalos-rpc/Dispatch";
import { Event } from "@kalos-core/kalos-rpc/Event";

export interface State {
  techs : DispatchableTech[];
  dismissedTechs : DispatchableTech[];
  calls : DispatchCall[];
  departmentIds : number[];
  jobTypes : number[];
}

export type Action = 
  | { type : 'setTechs'; data : DispatchableTech[] }
  | { type : 'setDismissedTechs'; data : DispatchableTech[] }
  | { type : 'setCalls'; data : DispatchCall[] }
  | { type : 'setDepartmentIds'; data : number[] }
  | { type : 'setJobTypes'; data: number[] }

export const reducer = (state : State, action : Action) => {
  switch (action.type){
    case 'setTechs':
      return {
        ...state,
        techs : action.data
      }
    case 'setDismissedTechs':
      return {
        ...state,
        dismissedtechs : action.data
      }
    case 'setCalls':
      return {
        ...state,
        calls : action.data
      }
    case 'setDepartmentIds':
      return {
        ...state,
        departmentIds : action.data
      }
    default:
      return state
  }

}