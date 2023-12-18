import {ref} from 'vue'
import {ElMessageBox} from "element-plus";


const openControlCabinet = ref(false)
const handleOpenControlCabinet = () => {
    openLoopDetail.value = false
    openControlCabinet.value = true
}
const handleCloseControlCabinet = () => {
    openControlCabinet.value = false
}


const openLoopDetail = ref(false)
const loopId = ref(null)
const handleOpenLoopDetail = (item) => {
    if(item.loopId){
        loopId.value = item.loopId
        openControlCabinet.value = false
        openLoopDetail.value = true
    }else{
        ElMessageBox.confirm('该设备未绑定回路，无法查看！','提示',{
            type:'info',
            showCancelButton:false
        }).then(() => {
            console.log('关闭弹窗')
        }).catch(() =>  {
            console.log('关闭弹窗')
        })
    }

}
const handleCloseLoopDetail = () => {
    openLoopDetail.value = false
}

export {
    openControlCabinet,
    handleOpenControlCabinet,
    handleCloseControlCabinet,
    openLoopDetail,
    loopId,
    handleOpenLoopDetail,
    handleCloseLoopDetail
}

