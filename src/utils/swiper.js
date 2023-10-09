// swiper 额外组件配置
import SwiperCore, {
/*  Pagination,*/
  Autoplay,
  Navigation,
  A11y,
  Parallax,
  EffectFade,
  Lazy
} from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/parallax'
import 'swiper/css/effect-fade'

// swiper 必备组件
import { Swiper, SwiperSlide } from 'swiper/vue'

// 使用额外组件
SwiperCore.use([
  Autoplay,
/*  Pagination,*/
  Navigation,
  A11y,
  Parallax,
  EffectFade,
  Lazy
])

// 全局注册 swiper 必备组件
const plugins = [Swiper, SwiperSlide]

const swiper = {
  install: function (app) {
    plugins.forEach((item) => {
      app.component(item.name, item)
    })
  }
}

export default swiper
