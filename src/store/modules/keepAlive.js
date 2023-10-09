import { defineStore } from 'pinia'
const useKeepStore = defineStore('keep', {
  state: () => {
    return {
      keepList:[]
    }
  },
  actions: {
    setKeep(payload){
      if(!this.keepList.includes(payload)){
        this.keepList.push(payload)
      }
    },
    removeKeep(payload){
      const index = this.keepList.findIndex(d => d === payload)
      if(index >= 0){
        this.keepList.splice(index, 1)
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'keepStore',
        storage: localStorage,
        paths: ['keepList']
      }
    ]
  }
})

export default useKeepStore
