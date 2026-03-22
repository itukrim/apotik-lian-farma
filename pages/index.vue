<template>
  <div>
    <div class="bg-white text-black rounded-2xl py-6 pl-8 pr-8 mb-6">
      <div class="flex flex-col md:flex-row justify-between">
        <div class="flex-1">
          <p class="text-[32px] font-bold">Welcome...</p>
          <span class="text-xs font-light block md:pr-0 xl:pr-40 mt-2 mb-[14px]">Embrace the day with enthusiasm and determination. Seize every opportunity, overcome challenges, and make the most of your time. You've got this! Rise up and shine bright!</span>
        </div>
        <div class="flex items-center gap-2 justify-start py-3 px-6">
          <div class="w-12 h-12 bg-[#B4DC19] text-white rounded-full flex items-center justify-center p-4">
            <Icon class="text-2xl" icon="medical_services" />
          </div>
          <div>
            <span class="text-[8px] font-semibold">Total Medicine</span>
            <h4 class="text-2xl font-semibold leading-[24px]">{{ medicines?.length }}</h4>
          </div>
        </div>
        <div class="flex items-center gap-2 justify-start py-3 px-6">
          <div class="w-12 h-12 bg-[#B4DC19] text-white rounded-full flex items-center justify-center p-4">
            <Icon class="text-2xl" icon="trending_up" />
          </div>
          <div>
            <span class="text-[8px] font-medium">Completed Transaction</span>
            <h4 class="text-2xl font-semibold leading-[24px]">{{ payslips?.length }}</h4>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-6">
      <section class="w-full md:w-3/5">
        <div class="h-96 bg-white rounded-xl flex flex-col px-8 pt-4 pb-8">
          <div>
            <h4 class="text-base font-semibold">Sales Overview</h4>
            <p class="text-xs font-light mt-1 mb-4">Total number of sales per month</p>
          </div>
          <div class="block flex-1">
            <Line class="bg-white pb-8 rounded-2xl" :data="data" :options="options" />
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <div class="bg-black flex flex-col p-3 gap-3 text-white items-center justify-center rounded-lg w-max">
            <span class="font-semibold text-[8px]">Today Transaction</span>
            <span class="font-semibold text-2xl">9</span>
          </div>
          <div class="bg-white flex flex-col py-4 px-[22px] gap-2 text-black justify-center items-start rounded-lg w-max text-[8px]">
            <span class="font-light">{{ today }}</span>
            <ul class="flex gap-2">
              <li v-for="data in daysOfWeek" class="flex flex-col items-center p-1 gap-2 rounded-full"
              :class="date.getDate() == data.date ? 'bg-black text-white' : 'bg-white'">
                <span class="text-[#A1A1AA]">{{ data.day }}</span>
                <span>{{ data.date }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section class="w-full md:w-2/5 flex flex-col">
        <div class="bg-[#1A1A1A] rounded-xl text-white p-4 mb-6 flex flex-col bg-[url('~/assets/images/wave.svg')] bg-no-repeat bg-right-bottom">
          <h4 class="font-semibold">Profit Information</h4>
          <p class="text-xs font-light mt-0.5">Below is a piece of information regarding the stability of income from total sales that occur!</p>
          <div class="flex mt-5 mb-4 gap-3">
            <div class="py-2 px-3 rounded-md flex-grow bg-white bg-opacity-20">
              <p class="font-semibold text-xs">Gross</p>
              <span class="font-semibold text-lg">
                IDR {{ idrFormatter(grossProfit) }}
              </span>
            </div>
            <div class="py-2 px-3 rounded-md flex-grow bg-white bg-opacity-20">
              <p class="font-semibold text-xs">Net</p>
              <span class="font-semibold text-lg">
                IDR {{ idrFormatter(netProfit) }}
              </span>
            </div>
          </div>
          <button class="bg-[#B4DC19] text-black rounded-full text-[10px] py-1 px-6 self-end transition-all hover:bg-opacity-90">
            <span>export</span>
          </button>
        </div>
        <div class="bg-white rounded-xl px-6 py-4 flex-1">
          <h4 class="font-semibold">Stock Reminder</h4>
          <p class="text-xs font-light border-b border-b-[#dddddd] pb-3 mt-0.5">Get notified when items are running low. It's your ticket to snagging those must-have items before they're gone!</p>
          <div v-if="lowStocks.length" class="md:h-36 md:overflow-scroll mt-2">
            <div v-for="item, i in lowStocks" class="text-xs mt-2 font-light" :key="i">
              <span class="font-bold">{{ item.name }}</span>
              only <span class="font-bold bg-yellow-300 px-1 rounded-sm">{{ item.stock }}</span> left in stock!
            </div>
          </div>
          <p v-else class="text-xs font-extralight text-center w-4/5 mx-auto bg-lime-300 p-2 mt-8 rounded-lg">Well done! No medicine restocking required. Keep up the great work in maintaining our inventory efficiently!</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
)

const supabase = useSupabaseClient()
const { idrFormatter } = useUtils()

const currentYear = new Date().getFullYear()
const dataCounts = ref(Array(12).fill(0))
const data = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Medicines Sold',
      backgroundColor: '#BEF264',
      data: dataCounts,
      tension: 0.3,
      pointRadius: 0,
    }
  ]
})

const lowStocks = ref<Medicine[]>([])
const grossProfit = ref<number>(0)
const netProfit = ref<number>(0)

const { data: medicines } = await useAsyncData('medicine', async () => {
  try {
    const { data: allMedicine } = await supabase.from('medicine').select('*').order('created_at')
    const { data: allLowStocks } = await supabase.from('medicine').select('name, stock').lte('stock', 5).order('created_at')
    lowStocks.value = allLowStocks as any

    netProfit.value = allMedicine?.reduce((total, currentItem) => {
      const { original_price, sold } = currentItem;
      const totalCost = parseFloat(original_price) * sold;
      return total + totalCost;
    }, 0) as number
    return allMedicine as Medicine[]
  } catch (error: any) {
    console.log(error.message)
  }
})

const { data: payslips } = await useAsyncData('paylisp', async () => {
  try {
    const { data: allPayslip } = await supabase.from('payslip').select('*') as { data: Array<{ [x: string]: any; transaction_date: string }> }
    const { data: allTotal } = await supabase.from('payslip').select('total')
    grossProfit.value = allTotal?.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0) as number

    allPayslip?.forEach(transaction => {
      const transactionDate = new Date(transaction.transaction_date)
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth();

      if (transactionYear === currentYear) {
          dataCounts.value[transactionMonth] += transaction.shopping_list.reduce((total: number, item: { qty: number; }) => +total + +item.qty, 0);
      }
    })

    return allPayslip as Payslip[]
  } catch (error: any) {
    console.log(error.message)
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
  },
  borderColor: "#65A30D",
  plugins: {
    tooltip: {
      callbacks: {
          labelColor: () => {
            return {
              borderColor: '#000000',
              backgroundColor: '#BEF264',
              borderRadius: 2,
            };
          },
      }
    }
  },
  scales: {
    y: {
      ticks: {
        color: "#D9D9D9",
      },
      grid: {
        drawTicks: false,
      },
      border: {
        dash: [5],
      },
    },
    x: {
      ticks: {
        color: "#D9D9D9",
      },
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
    },
  },
}

interface DateInit {
    day: string
    date: number
}

const date = new Date()
const today = `${date.toLocaleDateString('en-US', { weekday: 'long' })}, ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '')}`

const daysOfWeek = ref<DateInit[]>([]);

function printWeekDays() : DateInit[] {
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const currentDay = date.getDay();
    const sunday = new Date(date);
    sunday.setDate(sunday.getDate() - currentDay);

    const dates: DateInit[] = []
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(sunday);
        currentDate.setDate(currentDate.getDate() + i);
        dates.push({day: daysOfWeek[currentDate.getDay()], date: currentDate.getDate()})
    }
    return dates
}

daysOfWeek.value = printWeekDays();

onMounted(() => {

})
</script>

<style lang="postcss" scoped>
</style>