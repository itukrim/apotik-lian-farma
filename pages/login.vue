<template>
  <div class="h-screen w-screen bg-white flex">
    <div class="w-1/2 bg-[url('~/assets/images/bg_login_hero.jpg')] bg-no-repeat bg-cover h-full items-center justify-center hidden md:flex">
      <div class="font-bold text-5xl p-8 rounded-2xl bg-black bg-opacity-10 backdrop-blur-xl leading-[56px]">
        <h2>Apotik</h2>
        <h2 class="text-lime-500">Lian Farma</h2>
      </div>
    </div>
    <div class="w-full md:w-1/2 flex items-center justify-center">
      <form @submit.prevent="signIn" class="w-[348px] flex flex-col gap-4">
        <Xinput v-model="email" icon="person_outline" class="" placeholder="email" required />
        <Xinput v-model="password" icon="lock_outline" class="" placeholder="password" type="password" required />

        <div v-if="errorMsg" class="text-xs">
          <Icon icon="info" class="align-top mr-1 text-red-500" />
          <span class="text-red-500">{{ errorMsg }}</span>
        </div>

        <button type="submit" class="bg-gradient-to-r from-lime-500 to-green-700 rounded-full text-white font-semibold px-3 py-2 mt-8 w-full hover:opacity-90 transition-all" :disabled="loading"
        :class="loading ? 'animate-pulse' : ''">
          <span>Sign in</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "blank",
});

const supabase = useSupabaseClient()
const router = useRouter()

const email = ref("")
const password = ref("")
const errorMsg = ref(null)
const loading = ref(false)

const signIn = async () => {
  loading.value = true
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    if (error) throw error

    loading.value = false
    router.push('/')
  } catch (error: any) {
    loading.value = false
    errorMsg.value = error.message
  }
}
</script>
