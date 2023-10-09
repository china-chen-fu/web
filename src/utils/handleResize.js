import {ref,computed} from 'vue'


const calcNavWidth = (sessionItemName) => {
  const navWidth = ref(0)
  navWidth.value = localStorage.getItem(sessionItemName) ? Number(localStorage.getItem(sessionItemName)) : 252
  const navWidthStr = computed(() => {
    return `${navWidth.value }px`
  })
  
  const dragDiv = (e) => {
    const initWidth = navWidth.value
    const beginX = e.clientX
    document.onmousemove = (e) => {
      const x = e.clientX - beginX;
      if(initWidth + x < 252){
        navWidth.value = 252
        dragUp()
      }else{
        navWidth.value = initWidth + x
      }
    };
  };
  
  const dragUp = () => {
    localStorage.setItem(sessionItemName,String(navWidth.value))
    document.onmousemove = null;
  };
  return  {
    navWidthStr,dragDiv,dragUp
  }
}

export default calcNavWidth