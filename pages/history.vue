<template>
  <Modal v-if="state.isDetailTransaction" title="Transaction Detail" @closeModal="handleModalDetail()">
    <div class="w-full" ref="pdfSection">
      <div class="font-bold text-2xl">
        <span class="mr-2">Apotik</span>
        <span class="text-lime-500">Lian Farma</span>
      </div>
      <span class="block text-[10px] font-light text-[#A1A1A1] mb-3">{{ dateFormatter(payslip?.transaction_date as string) }}</span>
      <span class="text-xs font-semibold">Transaction number:</span>
      <h5 class="text-sm mt-0.5 mb-3 font-semibold">{{ payslip?.transaction_number }}</h5>

      <div class="pt-3 pr-2 pb-2 pl-3 bg-[#FAFAFA] rounded-lg mb-6">
        <span class="font-semibold text-[10px] mb-3">Details</span>
        <table class="table-auto w-full mb-2">
          <tbody>
            <tr v-for="item, i in payslip?.shopping_list" :key="i" class="border-none text-[10px] font-normal">
              <td class="py-0">{{ item.medicine_name }} <br> {{ item.price }}</td>
              <td class="py-0 align-top">{{ item.qty }}x</td>
              <td class="text-right py-0 align-top">{{ item.subtotal }}</td>
            </tr>
          </tbody>
        </table>
        <span class="text-[#A1A1A1] text-[10px] mb-2">items ({{ payslip?.shopping_list.length }})</span>
        <div class="flex justify-between font-semibold text-lg">
          <span>Total: </span>
          <span>{{ idrFormatter(payslip?.total as number) }}</span>
        </div>
      </div>
    </div>
    <button type="submit" class="w-full flex items-center justify-center gap-[6px] bg-gradient-to-r from-lime-500 to-green-700 rounded-full text-white font-medium px-4 py-2" @click="exportToPDF(`${payslip?.transaction_number}.pdf`, pdfSection)">
      <Icon icon="picture_as_pdf" />
      <span class="text-xs">Print Receipt</span>
    </button>
  </Modal>
  <div class="pr-4">
    <Search v-model="transactionNumber" label="Search by transaction number..." class="w-full md:w-2/5 mb-6" />
    <div class="bg-white rounded-lg overflow-auto table-history mb-6">
      <table v-if="payslips?.length" class="table-auto w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Transaction Number</th>
            <th>Transaction Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="history, i in paginatedItems">
            <td>{{ i+1 }}</td>
            <td>{{ history.transaction_number }}</td>
            <td>{{ dateFormatter(history.transaction_date) }}</td>
            <td class="text-center">
              <span class="bg-yellow-300 text-black whitespace-nowrap rounded-full px-2 py-1 mx-1.5 text-[10px] cursor-pointer hover:bg-yellow-400 transition-all" @click="handleModalDetail(history)">
                <Icon icon="receipt" class="align-top mr-1" />
                <span>view receipt</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center w-1/2 mx-auto my-6">
        <h5 class="font-medium text-xl">Empty!</h5>
        <p class="text-xs font-light mt-1 text-gray-500">It looks like there is no transaction at the moment.</p>
      </div>
    </div>
    <div v-if="payslips?.length" class="pagination absolute right-16">
      <button @click="prevPage" :disabled="currentPage === 1">
        <Icon icon="arrow_back_ios" class="w-[6px]" />
      </button>
      <div class="page-numbers">
        <button @click="gotoPage(1)" :class="{ active: currentPage === 1 }">1</button>
        <span v-if="showEllipsisStart">...</span>
        <button v-if="totalPages > 2"
          @click="gotoPage(displayedPages[1]++)"
          :class="{ active: currentPage === displayedPages[1] }"
        >
          {{ displayedPages[1] }}
        </button>
        
        <span v-if="showEllipsisEnd">...</span>
        <button v-if="totalPages > 1" @click="gotoPage(totalPages)" :class="{ active: currentPage === totalPages }">{{ totalPages }}</button>
      </div>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        <Icon icon="arrow_forward_ios" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { exportToPDF } from '#imports'
import type { RealtimeChannel } from '@supabase/supabase-js'

const supabase = useSupabaseClient()
let realtimeChannel: RealtimeChannel

const pdfSection = ref<HTMLElement>()

const { idrFormatter, dateFormatter } = useUtils()

const state = reactive({
  isDetailTransaction: false
})

const payslip = ref<Payslip>()
const { data: payslips, refresh: refreshPayslips } = await useAsyncData('paylisp', async () => {
  try {
    const { data } = await supabase.from('payslip').select('*').order('transaction_date', {ascending: false})
    return data as Payslip[]
  } catch (error: any) {
    console.log(error.message)
  }
})

const transactionNumber = ref('')

watch(transactionNumber, async (newValue, _) => {
  if (newValue != '') {
    try {
      const { data: searchedPayslip } = await supabase.from('payslip').select('*').ilike('transaction_number', `%${newValue}%`)
      payslips.value = searchedPayslip
    } catch (error) {
      console.log(error)
    }
  } else {
    const { data } =  await supabase.from('payslip').select('*').order('transaction_date', {ascending: false})
    payslips.value = data
  }
})

const handleModalDetail = (data?: Payslip) => {
  state.isDetailTransaction = !state.isDetailTransaction
  if (state.isDetailTransaction) {
    payslip.value = data
  }
}

onMounted(() => {
  realtimeChannel = supabase.channel('public:payslip').on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'paylip' },
    () => refreshPayslips()
  )
  realtimeChannel.subscribe()
})
onUnmounted(() => {
  supabase.removeChannel(realtimeChannel)
})

const itemsPerPage = 10;
const maxDisplayedPages = 3;
const currentPage = ref(1);


const totalPages = computed(() => {
  if (payslips.value) {
    return Math.ceil(payslips.value.length / itemsPerPage);
  }
  return 0;
});

const paginatedItems = computed(() => {
  if (payslips.value) {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return payslips.value.slice(startIndex, endIndex);
  }
  return [];
});

const displayedPages = computed(() => {
  const pages: number[] = [];
  let start = 1;
  let end = totalPages.value;

  if (totalPages.value > maxDisplayedPages) {
    const half = Math.floor(maxDisplayedPages / 3);
    if (currentPage.value > half + 1) {
      start = currentPage.value - half;
      end = currentPage.value + half;
      if (end > totalPages.value) {
        end = totalPages.value;
        start = end - maxDisplayedPages + 1;
      }
    } else {
      end = maxDisplayedPages;
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const showEllipsisStart = computed(() => displayedPages.value[0] > 1);
const showEllipsisEnd = computed(() => displayedPages.value[displayedPages.value.length - 1] < totalPages.value);

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function gotoPage(page: number) {
  currentPage.value = page;
}
</script>

<style lang="postcss" scoped>
table {
  @apply font-light text-sm;
}

th {
  @apply text-left py-2;

  &:last-of-type {
    @apply text-center;
  }
}

tr {
  td {
    @apply py-1;
  }
}

.table-history {
  table {
    @apply font-normal text-xs rounded-lg border border-white overflow-hidden;
  }
  
  thead {
    @apply bg-gray-100 border border-white;
  }
  
  th {
    @apply text-center p-3 font-medium border border-white;
  
    &:last-of-type {
      @apply text-center;
    }
  }
  tbody tr {
    @apply transition-all;
  
    td {
      @apply py-[10px] px-3;
  
      &:first-child {
        @apply text-center;
      }
    }
  
    &:hover {
      @apply bg-gray-100;
    }
  }
}

.pagination {
  @apply flex text-xs gap-4 font-medium items-center;

  button {
    @apply p-[6px] w-6 h-6 rounded flex justify-center items-center;

    &:hover:not(:disabled) {
      @apply bg-gray-200;
    }

    &:disabled {
      @apply text-gray-300;
    }
  }
}

.page-numbers {
  @apply flex gap-4;
}

.page-numbers button {
  @apply p-[6px] w-6 h-6 rounded flex justify-center items-center;

  &:hover {
    @apply bg-gray-200;
  }
}

.page-numbers button.active {
  @apply bg-[#DDDDDD]
}
</style>