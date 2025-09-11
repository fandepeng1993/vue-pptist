import {user} from "./store";

export default class QianKunStore{
    props:any
    constructor(props:any){
        this.props = props;
        // console.log(this.props)
        if(this.props){
            this.props.onGlobalStateChange(this.onGlobalStateChange);
            this.onEmitterEvent();
            this.setUserToken(this.props.globalState.token);
        }
    }
    setUserToken(token:string){
        user().updateToken(token);
    }
    onEmitterEvent(){
        this.props.emitter.on("main-setToken",(val:any)=>{
            console.log(user(),val)
            user().updateToken(val.token);
        })
    }
    dispatchEmitter(eventName:string,data:any){
        this.props.emitter.emit(eventName,data);
    }
    onGlobalStateChange(state:any,prev:any){
        // state: 变更后的状态; prev 变更前的状态
        console.log("sub-app-onGlobalStateChange",state, prev);
    }
    setGlobalState(state:any){
        this.props.setGlobalState(state)
    }
}

