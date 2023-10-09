import * as echarts from "echarts";
import { bind, clear } from "size-sensor";

const defaultResizeOpt = {
  width: "auto",
  height: "auto",
};
export default function useEcharts(el, opt = {}) {
  // echarts实例
  let instance = null;
  const setOption = (option) => {
    if (!instance) {
      initChart(el);
    }
    hideLoading();
    instance.setOption(option);
  };

  const showLoading = () => {
    if (!instance) initChart(el);
    instance.showLoading();
  };
  const hideLoading = () => {
    instance.hideLoading();
  };
  const resize = (opt = {}) => {
    try {
      instance.resize(opt || defaultResizeOpt);
    } catch (e) {
      console.warn(e);
    }
  };
  const dispose = () => {
    const ele = el;
    if (instance && !instance.isDisposed()) {
      try {
        clear(ele);
      } catch (e) {
        console.warn(e);
      }
      instance.dispose();
    }
  };

  const initChart = (el) => {
    if (!el) return;
    const {
      autoResize = true,
      renderer = "canvas",
      theme = "default",
      width = "auto",
      height = "auto",
    } = opt;
    instance = echarts.init(el, theme, {
      renderer: renderer,
      width,
      height,
    });
    if (autoResize) {
      bind(el, () => {
        resize();
      });
    }
  };

  watchEffect((onInvalidate) => {
    onInvalidate(() => {
      // invalidate previously pending async operation
      dispose();
    });
    if (instance !== null) return;
    initChart(el);
  });
  return {
    setOption,
    showLoading,
    hideLoading,
  };
}
