import dayjs from "dayjs";
//可选时间的开始时间和结束时间
export function useDisabledDate(queryParams) {
  let disabledStartTimeStamp = ref();
  let disabledEndTimeStamp = ref();
  const startTimeFocus = () => {
    disabledStartTimeStamp.value = "";
    if (queryParams.endTime) {
      disabledEndTimeStamp.value = dayjs(queryParams.endTime).valueOf();
    } else {
      disabledEndTimeStamp.value = "";
    }
  };

  const startTimeChange = () => {
    queryParams.endTime = "";
  };

  const endTimeFocus = () => {
    disabledEndTimeStamp.value = "";
    if (queryParams.startTime) {
      disabledStartTimeStamp.value = dayjs(queryParams.startTime).valueOf();
    } else {
      disabledStartTimeStamp.value = "";
    }
  };

  const hourDisabledDate = (time) => {
    //开始时间不能大于结束时间 并且不能小于超过4天的时间 任意一个时间为空，另一个时间选择没有限制
    if (disabledStartTimeStamp.value) {
      if (
        time.getTime() >= disabledStartTimeStamp.value &&
        time.getTime() <=
          dayjs(disabledStartTimeStamp.value).add(3, "days").valueOf()
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      if (disabledEndTimeStamp.value) {
        if (
          time.getTime() <= disabledEndTimeStamp.value &&
          time.getTime() >=
            dayjs(disabledEndTimeStamp.value).subtract(3, "days").valueOf()
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  };

  const dayDisabledDate = (time) => {
    //日不超过90天
    if (disabledStartTimeStamp.value) {
      if (
        time.getTime() >= disabledStartTimeStamp.value &&
        time.getTime() <=
          dayjs(disabledStartTimeStamp.value).add(89, "days").valueOf()
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      if (disabledEndTimeStamp.value) {
        if (
          time.getTime() <= disabledEndTimeStamp.value &&
          time.getTime() >=
            dayjs(disabledEndTimeStamp.value).subtract(89, "days").valueOf()
        ) {
          // 2年前
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  };

  const monthDisabledDate = (time) => {
    //月不超过60月
    if (disabledStartTimeStamp.value) {
      if (
        time.getTime() >= disabledStartTimeStamp.value &&
        time.getTime() <=
          dayjs(disabledStartTimeStamp.value).add(59, "months").valueOf()
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      if (disabledEndTimeStamp.value) {
        if (
          time.getTime() <= disabledEndTimeStamp.value &&
          time.getTime() >=
            dayjs(disabledEndTimeStamp.value).subtract(59, "months").valueOf()
        ) {
          // 2年前
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  };

  const yearDisabledDate = (time) => {
    //年不超过5年
    if (disabledStartTimeStamp.value) {
      if (
        time.getTime() >= disabledStartTimeStamp.value &&
        time.getTime() <=
          dayjs(disabledStartTimeStamp.value).add(4, "years").valueOf()
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      if (disabledEndTimeStamp.value) {
        if (
          time.getTime() <= disabledEndTimeStamp.value &&
          time.getTime() >=
            dayjs(disabledEndTimeStamp.value).subtract(4, "years").valueOf()
        ) {
          // 2年前
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  };

  const timeTypeChange = (val) => {
    switch (val) {
      case "0": {
        queryParams.startTime = dayjs().format("YYYY-MM-DD 00");
        queryParams.endTime = dayjs().format("YYYY-MM-DD HH");
        break;
      }
      case "1": {
        queryParams.startTime = dayjs().subtract(29, "days").format("YYYY-MM-DD")
        queryParams.endTime = dayjs().format("YYYY-MM-DD")
        break;
      }
      case "2": {
        queryParams.startTime = dayjs().subtract(11, "month").format("YYYY-MM");
        queryParams.endTime = dayjs().format("YYYY-MM");
        break;
      }
      case "3": {
        queryParams.startTime = dayjs().subtract(2, "year").format("YYYY");
        queryParams.endTime = dayjs().format("YYYY");
        break;
      }
      default: {
        queryParams.startTime = undefined;
        queryParams.endTime = undefined;
        break;
      }
    }
  };

  return {
    startTimeChange,
    startTimeFocus,
    endTimeFocus,
    hourDisabledDate,
    dayDisabledDate,
    monthDisabledDate,
    yearDisabledDate,
    timeTypeChange
  };
}
