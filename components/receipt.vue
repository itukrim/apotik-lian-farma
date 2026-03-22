<template>
  <div class="bg-white rounded-lg w-2/5">
      <div class="bg-gradient-to-r from-[#4AA48F] to-[#439582] text-white rounded-t-lg px-4 py-2">
        <h2 class="font-bold text-lg">PAYMENT CONFIRMATION RECEIPT</h2>
      </div>
      <div class="relative flex justify-center items-center p-6">
        <div class="w-full">
          <Brand />
          <span class="block text-xs font-light text-gray-400 mb-2">September 22, 2023 at 11:25:07 AM</span>
          <span class="font-bold text-xs">Transaction number:</span>
          <h5>6UU7J-1695356707339</h5>
          <table class="table-auto w-full mt-4 mb-2">
            <thead>
              <tr>
                <th>Qty</th>
                <th>Product Name</th>
                <th>price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2</td>
                <td>L-Men Gain Mass 200gr</td>
                <td>46000</td>
                <td class="text-center">46.000</td>
              </tr>
            </tbody>
          </table>
          <div class="text-right mr-4 mt-4">
            <span class="text-sm font-bold mr-2">Total: </span>
            <span class="text-2xl font-bold">46.000</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
</script>