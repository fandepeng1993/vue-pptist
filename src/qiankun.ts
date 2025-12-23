import {useUserStore} from './store'

export default class QianKunStore {
  props:any
  emitter:any
  constructor(props:any) {
    this.props = props
    this.emitter = null
    if (this.props) {
      this.props.onGlobalStateChange(this.onGlobalStateChange)
      this.emitter = this.props.emitter
      this.onEmitterEvent()
      this.setUserToken(this.props.globalState.token)
    }
  }
  getGlobalState() {
    return this.props.globalState.getState()
  }
  setUserToken(token:string) {
    useUserStore().updateToken(token)
  }
  onEmitterEvent() {
    this.props.emitter.on('main-setToken', (val:any) => {
      // console.log(useUserStore(), val)
      useUserStore().updateToken(val.token)
    })
  }
  dispatchEmitter(eventName:string, data:any) {
    this.emitter.emit(eventName, data)
  }
  onGlobalStateChange(state:any, prev:any) {
    // state: 变更后的状态; prev 变更前的状态
    console.log('sub-app-onGlobalStateChange', state, prev)
  }
  setGlobalState(state:any) {
    this.props.setGlobalState(state)
  }
}

