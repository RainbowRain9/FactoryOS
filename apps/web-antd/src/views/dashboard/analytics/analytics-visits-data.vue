<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

onMounted(() => {
  renderEcharts({
    legend: {
      bottom: 0,
      data: ['当前季度', '上季度'],
    },
    radar: {
      indicator: [
        {
          name: '项目管理',
        },
        {
          name: '财务审批',
        },
        {
          name: '人事管理',
        },
        {
          name: '资料库',
        },
        {
          name: 'AI助手',
        },
        {
          name: '目标管理',
        },
      ],
      radius: '60%',
      splitNumber: 8,
    },
    series: [
      {
        areaStyle: {
          opacity: 1,
          shadowBlur: 0,
          shadowColor: 'rgba(0,0,0,.2)',
          shadowOffsetX: 0,
          shadowOffsetY: 10,
        },
        data: [
          {
            itemStyle: {
              color: '#b6a2de',
            },
            name: '当前季度',
            value: [85, 72, 68, 90, 95, 78],
          },
          {
            itemStyle: {
              color: '#5ab1ef',
            },
            name: '上季度',
            value: [75, 68, 62, 82, 88, 70],
          },
        ],
        itemStyle: {
          // borderColor: '#fff',
          borderRadius: 10,
          borderWidth: 2,
        },
        symbolSize: 0,
        type: 'radar',
      },
    ],
    tooltip: {},
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
