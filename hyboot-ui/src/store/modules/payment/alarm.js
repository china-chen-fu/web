
import { getAlarmNum } from '@/api/payment/alarmLog'
import { countAlarmNum } from '@/api/lamp/abnormalAlarm'
import warnService from "@/api/fire/warn"
import router from "@/router"

const useAlarmStore = defineStore(
  'alarm',
  {
    state: () => ({
      alarmNum: 0
    }),
    actions: {
      // 获取告警数量
      getAlarmNum (sysId) {
        return new Promise((resolve, reject) => {
          if (sysId == 3) {
            warnService.warnList({ alarmStatus: 0 }).then(res => {
              this.alarmNum = res.total;
              resolve(res)
            }).catch(error => {
              reject(error)
            })
          } else if (sysId == 1) {
            getAlarmNum().then(res => {
              this.alarmNum = res.data;
              resolve(res)
            }).catch(error => {
              reject(error)
            })
          } else if (sysId == 2) {
            countAlarmNum().then(res => {
              this.alarmNum = res.data;
              resolve(res)
            }).catch(error => {
              reject(error)
            })
          }
        })
      },
    }
  })

export default useAlarmStore
