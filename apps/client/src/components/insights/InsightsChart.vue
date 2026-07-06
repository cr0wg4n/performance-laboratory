<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import type { InsightPoint } from '@/utils/insights.util'
import { formatCurrency } from '@/utils/format.util'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface Props {
  series: InsightPoint[]
  currency: string
}

const props = defineProps<Props>()

const chartData = computed<ChartData<'line', number[], string>>(() => ({
  labels: props.series.map((point) => point.label),
  datasets: [
    {
      label: 'Income',
      data: props.series.map((point) => point.income),
      borderColor: '#16a34a',
      backgroundColor: 'rgba(22, 163, 74, 0.18)',
      pointBackgroundColor: '#16a34a',
      pointBorderColor: '#16a34a',
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      fill: true,
      tension: 0.35,
    },
    {
      label: 'Outcome',
      data: props.series.map((point) => point.outcome),
      borderColor: '#dc2626',
      backgroundColor: 'rgba(220, 38, 38, 0.15)',
      pointBackgroundColor: '#dc2626',
      pointBorderColor: '#dc2626',
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      fill: true,
      tension: 0.35,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 10,
        padding: 18,
      },
    },
    tooltip: {
      callbacks: {
        label(context) {
          return `${context.dataset.label}: ${formatCurrency(Number(context.parsed.y), props.currency)}`
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 0,
        autoSkip: true,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback(value) {
          return formatCurrency(Number(value), props.currency)
        },
      },
    },
  },
}))
</script>

<template>
  <div class="h-80 md:h-96">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
