<template>
  <Toast
    v-if="state.isPayNowError || state.isPayNowSuccess"
    :label="!state.isPayNowError ? 'Transaction Success!' : 'Transaction Error!'" 
    :type="!state.isPayNowError ? 'success' : 'error'" 
    :content="!state.isPayNowError ? state.isPayNowSuccess : state.isPayNowError"
  />

  <Modal v-if="state.isCheckout" title="Checkout" @closeModal="state.isCheckout = false">
      <div class="pt-3 pr-2 pb-2 pl-3 bg-[#FAFAFA] rounded-lg my-6">
        <span class="font-semibold text-[10px] mb-3">Details</span>
        <table class="table-auto w-full mb-2">
          <tbody>
            <tr v-for="item, i in shoppingList" :key="i" class="border-none text-[10px] font-normal">
              <td class="py-0">{{ item.medicine_name }} <br> {{ item.price }}</td>
              <td class="py-0 align-top">{{ item.qty }}x</td>
              <td class="text-right py-0 align-top">{{ item.subtotal }}</td>
            </tr>
          </tbody>
        </table>
        <span class="text-[#A1A1A1] text-[10px] mb-2">items ({{ shoppingList.length }})</span>
        <div class="flex justify-between font-semibold text-lg">
          <span>Total: </span>
          <span>{{ idrFormatter(totalPrice) }}</span>
        </div>
      </div>
    <button type="submit" class="w-full flex items-center justify-center gap-[6px] bg-gradient-to-r from-lime-500 to-green-700 rounded-full text-white font-medium px-4 py-2 hover:enabled:opacity-90 transition-all" :class="state.isPayNow && 'animate-pulse'" @click="payNow()" :disabled="state.isPayNow">
      <Icon :icon="state.isPayNow ? 'motion_photos_on' : 'check'" :class="state.isPayNow && 'animate-spin'" />
      <span class="text-xs">Pay Now</span>
    </button>
  </Modal>

  <div class="flex flex-col md:flex-row gap-6">
    <div class="w-full md:w-2/6 rounded-xl bg-white h-full px-6 py-4">
      <h5 class="font-semibold">Select Product</h5>
      <div>
        <Search class="my-4" v-model="barcode" label="Medicine name..." @keyup.enter="searchMedicineByBarcode()" />
        <div class="flex flex-col gap-4 text-sm">
          <div v-if="tempMedicine.length" v-for="item, i in tempMedicine" class="bg-white border border-gray-100 rounded-lg p-4">
            <p class="mb-4">
              <span class="text-xs font-medium block mb-0.5">{{ item.name }}</span>
              <span class="text-xs text-[#15803D] rounded-lg font-medium block mb-1">IDR {{ idrFormatter(item.selling_price) }}</span>
              <span class="text-[10px] rounded-full block px-2 py-0.5 max-w-fit" :class="item.stock < 1 ? 'text-red-500' : 'bg-lime-300 text-[#15803D]'">Stock {{ item.stock }}</span>
            </p>
            
            <div v-if="item.stock >= 1" class="flex justify-between items-center">
              <div class="selection:bg-none flex items-center justify-center">
                <button class="flex items-center justify-center w-4 h-4 rounded-full bg-[#DDDDDD] text-[#A1A1A1]" @click="qty <= 1 ? {} : qty--">
                  <Icon icon="remove" />
                </button>
                <input class="w-7 mx-2 text-center bg-white" v-model="qty" type="number" min="1" disabled />
                <button class="flex items-center justify-center w-4 h-4 rounded-full bg-[#15803D] text-white" @click="qty >= item.stock ? {} : qty++">
                  <Icon icon="add" />
                </button>
              </div>
              <!-- disable the button if the qty is 0 and the qty that user given is more than stock -->
              <button class="bg-black text-xs px-3 py-1 text-white rounded-full block disabled:opacity-50 disabled:bg-gray-200 hover:opacity-80 transition-all" :disabled="item.stock < 1" @click="addToCart(tempMedicine[i])">
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
          <div v-if="state.isNotFound" class="p-2 text-xs">
            <Icon icon="info" class="align-top mr-1 text-red-500" />
            <span class="text-red-500">No item found!</span>
          </div>
          <div v-if="state.isLoading" class="text-center text-lg">
            <Icon icon="motion_photos_on" class="text-lime-400 align-top animate-spin inline-block" />
          </div>
        </div>
      </div>
    </div>
    <div class="relative w-full md:w-4/6 rounded-xl bg-white h-max">
      <h5 class="font-semibold px-4 py-[14px] bg-gradient-to-r from-[#84CC16] to-[#15803D] text-white rounded-t-xl">Shopping List</h5>
      <div v-if="shoppingList.length">
        <div class="flex flex-col items-end px-4 pt-4 pb-6 table-shopping__list">
          <table class="table-auto w-full mb-6">
            <thead>
              <tr>
                <th>No</th>
                <th>Medicine Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item, i in shoppingList" :key="i">
                <td>{{ i+1 }}</td>
                <td>{{ item.medicine_name }}</td>
                <td>{{ item.qty }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.subtotal }}</td>
                <td class="text-center">
                  <Icon icon="delete" class="bg-red-500 rounded-md p-1 text-white mx-1.5 cursor-pointer hover:bg-red-600 transition-all" @click="removeFromCart(i)" />
                </td>
              </tr>
            </tbody>
          </table>
          <button class="flex items-center bg-gradient-to-r from-lime-500 to-green-700 rounded-full text-white font-medium px-12 py-2 hover:opacity-90 transition-all" @click="state.isCheckout = true">
            <span class="text-xs">Checkout</span>
          </button>
        </div>
      </div>
      <div v-else class="text-center p-4 md:w-3/4 mx-auto">
        <h5 class="font-medium text-x">Empty!</h5>
        <p class="text-xs font-light mt-1 text-gray-500">Shopping list is empty at the moment. Start search the product in the select product input field. Specify the quantity and Hit "Add to Cart" to include the item in the shopping list.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()

const { idrFormatter, generateCode } = useUtils()

const barcode = ref('')
const qty = ref<number>(1)
const totalPrice = computed(() => shoppingList.value.reduce((accumulator, item) => accumulator + item.subtotal, 0))
const tempMedicine = ref<Medicine[]>([])
const shoppingList = ref<Item[]>([])
const tempDumpingShoppingData = ref<Medicine[]>([])

const state = reactive({
  isLoading: false,
  isNotFound: false,
  isPayNow: false,
  isPayNowSuccess: '',
  isPayNowError: '',
  isCheckout: false
})

const searchMedicineByBarcode = async () => {
  state.isLoading = true
  state.isNotFound = false
  tempMedicine.value = []
  await useAsyncData('medicine', async () => {
    try {
      const { data } = await supabase.from('medicine').select('*').ilike('name', `%${barcode.value}%`)
      !data?.length ? state.isNotFound = true : state.isNotFound = false
      tempMedicine.value = data as Medicine[]
      state.isLoading = false
      return tempMedicine.value
    } catch (error: any) {
      state.isLoading = false
      console.log(error.message)
    }
  })
}

const addToCart = (medicine: Medicine) => {
  const item = {
    medicine_code: medicine.code,
    medicine_name: medicine.name,
    qty: qty.value,
    price: medicine.selling_price,
    subtotal: medicine.selling_price * qty.value
  }

  const dumpItem = {
    id: medicine.id,
    code: medicine.code,
    name: medicine.name,
    unit: medicine.unit,
    original_price: medicine.original_price,
    selling_price: medicine.selling_price,
    stock: medicine.stock - +qty.value,
    sold: medicine.sold + +qty.value,
  }

  const iTempDumpingShoppingData = tempDumpingShoppingData.value.findIndex(item => item.id === dumpItem.id);
  if (iTempDumpingShoppingData !== -1) {
    tempDumpingShoppingData.value[iTempDumpingShoppingData].sold += qty.value;
    tempDumpingShoppingData.value[iTempDumpingShoppingData].stock -= qty.value;
  } else {
    tempDumpingShoppingData.value.push(dumpItem)
  }

  const iShoppingList = shoppingList.value.findIndex(data => data.medicine_code === item.medicine_code)
  if (iShoppingList !== -1) {
    shoppingList.value[iShoppingList].qty += +qty.value;
    shoppingList.value[iShoppingList].subtotal += (medicine.selling_price * qty.value);
  } else {
    shoppingList.value.push(item)
  }

  tempMedicine.value = []
  barcode.value = ''
  qty.value = 1
}

const removeFromCart = (index: number) => {
  shoppingList.value.splice(index, 1)
  tempDumpingShoppingData.value.splice(index, 1)
}

const payNow = async () => {
  state.isPayNow = true
  state.isPayNowSuccess = ''
  state.isPayNowError = ''
  try {
    const { data: soldMedicines } = await supabase.from('medicine')
      .upsert(tempDumpingShoppingData.value as any)

    const { data: payslips, error } = await supabase.from('payslip').insert({
      transaction_number: generateCode(),
      transaction_date: new Date(),
      shopping_list: shoppingList.value,
      total: totalPrice.value
    } as any)

    if (error) throw error

    state.isPayNowSuccess = 'Purchase has been successfully processed. Kindly review the payslip in the history menu for a detailed record.'
    tempDumpingShoppingData.value = []
    shoppingList.value = []
    tempMedicine.value = []
    state.isPayNow = false
    state.isCheckout = false
  } catch (error: any) {
    state.isPayNow = false
    state.isCheckout = false
    state.isPayNowError = error.message
  }
}

watch(barcode, (newValue, _) => {
  if (newValue === '') {
    tempMedicine.value = []
    qty.value = 1
  }
})
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

.table-shopping__list {
  table {
    @apply font-normal text-xs rounded-lg border border-white;
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
  
      &:nth-child(n+3) {
        @apply text-center;
      }
  
      &:last-child {
        @apply px-6 text-[#A1A1A1];
      }
    }
  
    &:hover {
      @apply bg-gray-100;
  
      td:last-child {
        span {
          @apply bg-red-500 text-white;
  
          &:hover {
            @apply bg-red-600;
          }
        }
      }
    }
  }
}

input:is(:focus) {
  @apply outline-none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

select {
  @apply rounded-full px-4 py-2 text-sm border;
  -webkit-appearance: none;
  appearance: none;

  > option:not([value]) {
    @apply text-gray-400;
  }
}
</style>
