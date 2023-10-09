const dict_valve_online_status = [
  { label: "在线", value: "0"},
  { label: "离线", value: "1"},
];

//绑定类型(0流量计 1水表 2压力表)
const dict_device_type = [
  { label: "流量计", value: "0" },
  { label: "水表", value: "1" },
  { label: "压力表", value: "2" },
];

//告警类型
const dict_alarm_type = [
  { label: "压力告警", value: "0" },
  { label: "最小流量告警", value: "1" },
  { label: "管网漏损告警", value: "2" },
  { label: "离线告警", value: "3" },
  { label: "建筑漏损告警", value: "4" },
];

//流量监测
const dict_flow_status = [
  { label: "正常", value: "0", elTagType: "success" },
  { label: "较轻", value: "1", elTagType: "warning" },
  { label: "严重", value: "2", elTagType: "danger" },
];

//压力监测
const dict_pressure_status = [
  { label: "正常", value: "0", elTagType: "success" },
  { label: "超低", value: "1", elTagType: "warning" },
  { label: "超高", value: "2", elTagType: "danger" },
];

//口径粗细
const dict_pipe_size = [
  { label: "最细", value: "4" },
  { label: "偏细", value: "6" },
  { label: "正常", value: "8" },
  { label: "偏粗", value: "10" },
  { label: "最粗", value: "12" },
];

//表具类型
const dict_deviceType=[
  { label: "总表", value: "0" },
  { label: "分表", value: "1" },
]

//表具绑定  操作类型
const dict_oper_type = [
  {
    label: '绑定',
    value: '1'
  },
  {
    label: '解绑',
    value: '2'
  }
]

export {
  dict_valve_online_status,
  dict_device_type,
  dict_alarm_type,
  dict_flow_status,
  dict_pressure_status,
  dict_pipe_size,
  dict_deviceType,
  dict_oper_type
};
