<template>
  <Modal v-if="state.isAddMedicine" title="Add New Medicine" @closeModal="handleAddMedicineModal()">
    <form @submit.prevent="addNewMedicine()">
      <p class="font-light text-[10px] mb-6">Please complete the following details for adding medicine data. This information is crucial for accurate inventory management and customer service.</p>
      <div class="flex flex-col gap-4">
        <div class="inputs">
          <label for="Code">Code</label>
          <input type="text" v-model="medicinePayload.code" placeholder="code..." required>
        </div>
        <div class="inputs">
          <label for="Medicine Name">Medicine Name</label>
          <input type="text" v-model="medicinePayload.name" placeholder="medicine name..." required>
        </div>
        <div class="flex flex-col lg:flex-row justify-between gap-4 lg:flex-wrap">
          <div class="inputs flex-0">
            <label for="Original Price">Original Price</label>
            <input type="number" v-model="medicinePayload.originalPrice" placeholder="original price..." required>
          </div>
          <div class="inputs flex-1">
            <label for="Selling Price">Selling Price</label>
            <input type="number" v-model="medicinePayload.sellingPrice" placeholder="selling price..." required>
          </div>
        </div>
        <div class="flex items-end gap-4">
          <div class="inputs w-2/6">
            <label for="Stock">Stock</label>
            <input type="number" v-model="medicinePayload.stock" placeholder="stock..." required>
          </div>
          <select v-model="medicinePayload.unit" class="flex-1" required>
            <option disabled value="">Select Unit</option>
            <option>Strip</option>
            <option>Bottle</option>
            <option>Vial</option>
            <option>Box</option>
            <option>Sheet</option>
            <option>Tube</option>
            <option>Roll</option>
            <option>Ampoule</option>
            <option>Piece</option>
            <option>Sachet</option>
          </select>
        </div>
      </div>
      <button type="submit" class="text-white w-full bg-gradient-to-r from-lime-500 to-green-700 py-2 px-8 mt-8 rounded-full hover:enabled:opacity-90 transition-all" :class="state.isLoading && 'animate-pulse'" :disabled="state.isLoading">
        <Icon :icon="state.isLoading ? 'motion_photos_on' : 'check'" :class="state.isLoading && 'animate-spin'" class="inline-block align-top mr-[6px]" />
        <span class="font-medium text-sm">Create</span>
      </button>
    </form>
  </Modal>

  <Modal v-if="state.isUpdateMedicine" title="Update Medicine" @closeModal="handleUpdateMedicineModal()">
    <form @submit.prevent="updateMedicine()">
      <p class="font-light text-[10px] mb-6">Please complete the following details for adding medicine data. This information is crucial for accurate inventory management and customer service.</p>
      <div class="flex flex-col gap-4">
        <div class="inputs">
          <label for="Code">Code</label>
          <input type="text" v-model="medicinePayload.code" placeholder="code..." required>
        </div>
        <div class="inputs">
          <label for="Medicine Name">Medicine Name</label>
          <input type="text" v-model="medicinePayload.name" placeholder="medicine name..." required>
        </div>
        <div class="flex flex-col lg:flex-row justify-between gap-4 lg:flex-wrap">
          <div class="inputs flex-1">
            <label for="Original Price">Original Price</label>
            <input type="number" v-model="medicinePayload.originalPrice" placeholder="original price..." required>
          </div>
          <div class="inputs flex-1">
            <label for="Selling Price">Selling Price</label>
            <input type="number" v-model="medicinePayload.sellingPrice" placeholder="selling price..." required>
          </div>
        </div>
        <div class="flex items-end gap-4">
          <div class="inputs w-2/6">
            <label for="Stock">Stock</label>
            <input type="number" v-model="medicinePayload.stock" placeholder="stock..." required>
          </div>
          <select v-model="medicinePayload.unit" class="flex-1" required>
            <option disabled value="">Select Unit</option>
            <option>Strip</option>
            <option>Bottle</option>
            <option>Vial</option>
            <option>Box</option>
            <option>Sheet</option>
            <option>Tube</option>
            <option>Roll</option>
            <option>Ampoule</option>
            <option>Piece</option>
            <option>Sachet</option>
          </select>
        </div>
      </div>
      <button type="submit" class="text-white w-full bg-gradient-to-r from-lime-500 to-green-700 py-2 px-8 mt-8 rounded-full hover:enabled:opacity-90 transition-all" :class="state.isLoading && 'animate-pulse'" :disabled="state.isLoading">
        <Icon :icon="state.isLoading ? 'motion_photos_on' : 'upgrade'" :class="state.isLoading && 'animate-spin'" class="inline-block align-top mr-[6px]" />
        <span class="font-medium text-sm">Update</span>
      </button>
    </form>
  </Modal>

  <Modal v-if="state.isDeleteMedicine" title="Remove Medicine" @click="handleDeleteMedicineModal()">
    <div class="p-6 text-center">
      <h3 class="font-semibold">{{ medicinePayload.name }}</h3>
      <h5 class="mb-1 mt-3 text-sm">Are you sure you want to delete this data?</h5>
      <span class="text-xs font-light mt-2 block">You're about to permanently delete the selected data. This action cannot be undone. Please review your selection and consider the consequences before confirming.</span>
    </div>
    <div class="flex gap-4  items-center justify-center">
      <button type="submit" class="bg-red-500 py-2 px-8 my-4 rounded-full hover:enabled:bg-red-600 text-white transition-all" :class="state.isLoading && 'animate-pulse'" @click="deleteMedicine()" :disabled="state.isLoading">
        <Icon :icon="state.isLoading ? 'motion_photos_on' : 'delete_forever'" :class="state.isLoading && 'animate-spin'" class="inline-block align-middle mr-1" />
        <span class="text-xs font-medium">Remove</span>
      </button>
    </div>
  </Modal>

  <div class="pr-4">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
      <Search v-model="medicineName" label="Search by code or medicine name..." class="w-full md:w-2/5" />
      <button type="submit" class="flex items-center gap-[6px] bg-gradient-to-r from-lime-500 to-green-700 rounded-full text-white font-medium px-4 py-2 hover:opacity-90 transition-all" @click="handleAddMedicineModal()">
        <Icon icon="add_circle" />
        <span class="text-xs">Add New Medicine</span>
      </button>
    </div>
    <div class="bg-white rounded-lg my-6">
      <div v-if="medicines?.length" class="overflow-scroll">
        <table class="table-auto w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Medicine name</th>
              <th>Unit</th>
              <th>Code</th>
              <th>Original Price</th>
              <th>Selling Price</th>
              <th>Stock</th>
              <th>Sold</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item, i in paginatedItems" :key="i">
              <td>{{ i+1 }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.unit }}</td>
              <td>{{ item.code }}</td>
              <td>{{ item.original_price }}</td>
              <td>{{ item.selling_price }}</td>
              <td>{{ item.stock }}</td>
              <td>{{ item.sold }}</td>
              <td>
                <Icon icon="edit" class="rounded-md p-1 mx-1.5 cursor-pointer transition-all" @click="handleUpdateMedicineModal(item)" />
                <Icon icon="delete_forever" class="rounded-md p-1 mx-1.5 cursor-pointer transition-all" @click="handleDeleteMedicineModal(item.code, item.name)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center w-1/2 mx-auto py-6">
        <h5 class="font-medium text-xl">Empty!</h5>
        <p class="text-xs font-light mt-1 text-gray-500">It looks like the medicine list is empty at the moment. Start adding the medicine data to intentory by clicking "Add Medicine" button and filling in all the required data on the form.</p>
      </div>
    </div>
    <div v-if="medicines?.length" class="pagination absolute right-16">
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
import type { RealtimeChannel } from '@supabase/supabase-js'

const supabase = useSupabaseClient()
let realtimeChannel: RealtimeChannel

const medicineForm = {
  code: "",
  name: "",
  unit: "",
  originalPrice: undefined,
  sellingPrice: undefined,
  stock: undefined,
}
const medicinePayload = reactive({ ...medicineForm })

const state = reactive({
  isAddMedicine: false,
  isUpdateMedicine: false,
  isDeleteMedicine: false,
  isLoading: false,
  errorMsg: ""
})

const { data: medicines, refresh: refreshMedicines } = await useAsyncData('medicine', async () => {
  try {
    const { data } = await supabase.from('medicine').select('*').order('created_at', {ascending: false})
    return data as Medicine[]
  } catch (error: any) {
    console.log(error.message)
  }
})

const handleAddMedicineModal = () => {
  state.isAddMedicine = !state.isAddMedicine
  Object.assign(medicinePayload, medicineForm)
}

const addNewMedicine = async () => {
  state.isLoading = true
  try {
    const { data, error } = await supabase.from('medicine').insert({
      code: medicinePayload.code,
      name: medicinePayload.name,
      unit: medicinePayload.unit,
      original_price: medicinePayload.originalPrice,
      selling_price: medicinePayload.sellingPrice,
      stock: medicinePayload.stock,
    } as any)
    if (error) throw error
    state.isAddMedicine = false
    state.isLoading = false
  } catch (error: any) {
    state.isLoading = false
    state.errorMsg = error.message
  }
}

const handleUpdateMedicineModal = (medicine?: Medicine) => {
  state.isUpdateMedicine = !state.isUpdateMedicine
  if (state.isUpdateMedicine) {
    if (medicine) {
      medicinePayload.code = medicine.code
      medicinePayload.name = medicine.name
      medicinePayload.unit = medicine.unit
      medicinePayload.originalPrice = medicine.original_price
      medicinePayload.sellingPrice = medicine.selling_price
      medicinePayload.stock = medicine.stock
    }
  }
}

const updateMedicine = async () => {
  state.isLoading = true
  try {
    const { data, error } = await supabase.from('medicine').update({
      code: medicinePayload.code,
      name: medicinePayload.name,
      unit: medicinePayload.unit,
      original_price: medicinePayload.originalPrice,
      selling_price: medicinePayload.sellingPrice,
      stock: medicinePayload.stock,
      updated_at: new Date(),
    } as never).eq("code", medicinePayload.code)
    if (error) throw error
    state.isUpdateMedicine = false
    state.isLoading = false
  } catch (error: any) {
    state.isLoading = false
    state.errorMsg = error.message
  }
}

const handleDeleteMedicineModal = (code?: string, name?: string) => {
  state.isDeleteMedicine = !state.isDeleteMedicine
  if (state.isDeleteMedicine) {
    if (code && name) {
      medicinePayload.code = code
      medicinePayload.name = name
    } 
  }
}

const deleteMedicine =  async () => {
  state.isLoading = true
  try {
    const { data, error } = await supabase.from('medicine').delete().eq('code', medicinePayload.code)
    if (error) throw error
    state.isDeleteMedicine = false
    state.isLoading = false
  } catch (error: any) {
    state.isLoading = false
    state.errorMsg = error.message
  }
}

onMounted(() => {
  realtimeChannel = supabase.channel('public:medicine').on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'medicine' },
    () => refreshMedicines()
  )
  realtimeChannel.subscribe()
})
onUnmounted(() => {
  supabase.removeChannel(realtimeChannel)
})

const medicineName = ref('')
watch(medicineName, async (newValue, oldValue) => {
  if (newValue != '') {
    console.log(medicines.value);
    try {
      const { data: searchedMedicine } = await supabase.from('medicine').select('*').ilike('name', `%${newValue}%`)
      medicines.value = searchedMedicine
    
    } catch (error) {
      // answer.value = 'Error! Could not reach the API. ' + error
    }
  } else {
    const { data } = await supabase.from('medicine').select('*').order('created_at', {ascending: false})
    medicines.value = data
  }
})

const itemsPerPage = 10;
const maxDisplayedPages = 3;
const currentPage = ref(1);


const totalPages = computed(() => {
  if (medicines.value) {
    return Math.ceil(medicines.value.length / itemsPerPage);
  }
  return 0;
});

const paginatedItems = computed(() => {
  if (medicines.value) {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return medicines.value.slice(startIndex, endIndex);
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
      span:first-of-type {
        @apply bg-yellow-300 text-black;

        &:hover {
          @apply bg-yellow-400;
        }
      }

      span:last-of-type {
        @apply bg-red-500 text-white;

        &:hover {
          @apply bg-red-600;
        }
      }
    }
  }
}

.inputs {
  @apply flex flex-col text-xs;

  label {
    @apply mb-1 text-[#15803D] font-medium;
  }

  input {
    @apply border border-[#DDDDDD] rounded-full px-4 py-3;
  }

  input:is(:focus) {
    @apply outline-black;
  }
  
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type=number] {
    -moz-appearance: textfield;
  }
}

select {
  @apply rounded-full px-4 py-3 text-xs border;
  -webkit-appearance: none;
  appearance: none;
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
