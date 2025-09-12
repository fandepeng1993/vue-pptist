import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: ''
  }),
  getters: {
    usertoken: (state) => state.token
  },
  actions: {
    updateToken(val:any) {
      this.token = val 
    },
    async AsyncUpdateToken(val:any) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.updateToken(val)
    }
  }
})