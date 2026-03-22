<template>
  <div class="flex">
    <button class="block md:hidden fixed top-9 right-6 z-40" @click="toggleNav()">
      <Icon :icon="state.navOpen ? 'close' : 'menu'" class="text-3xl" :class="state.navOpen && 'text-white'" />
    </button>
    <div class="fixed md:hidden inset-0 bg-black bg-opacity-40 z-20" v-if="state.navOpen"></div>
    <nav class="w-72 md:w-80 h-full md:h-screen fixed md:sticky top-0 left-0 bg-white z-30 transition-transform md:translate-x-0" :class="state.navOpen ? 'translate-x-0' : '-translate-x-full'">
      <aside class="h-full flex flex-col">
        <Brand />
        <div class="my-8 flex-1">
          <div class="flex flex-col gap-3">
            <NuxtLink to="/"><Icon icon="bar_chart" /><span>Dashboard</span></NuxtLink>
            <NuxtLink to="/medicine"><Icon icon="hdr_weak" /><span>Medicine</span></NuxtLink>
            <NuxtLink to="/cashier"><Icon icon="apps" /><span>Cashier</span></NuxtLink>
            <NuxtLink to="/history"><Icon icon="bookmark_border" /><span>History</span></NuxtLink>
          </div>
        </div>
        <div class="bg-gray-50 text-black rounded-lg py-3 px-[14px] mb-14 max-w-max self-center">
          <span class="font-semibold text-sm">Admin</span>
          <span v-if="user" class="block text-[10px] font-light">{{ user.email }}</span>
          <button @click="signOut" class="bg-black rounded-full text-white text-[10px] py-1 px-3 mt-3 transition-all block mx-auto" :disabled="state.loadSignOut">
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </nav>
    <div class="w-full">
      <header class="sticky top-0 p-9 bg-white">
        <div class="flex items-center">
          <div class="flex items-center justify-center w-12 h-12 text-4xl bg-lime-500 rounded-lg p-3">
            <Icon :icon="
              router.currentRoute.value.name === 'medicine'
              ? 'hdr_weak'
              : router.currentRoute.value.name === 'cashier'
              ? 'apps'
              : router.currentRoute.value.name === 'history'
              ? 'bookmark_border'
              : 'bar_chart'
              "
              class="text-white" />
          </div>
          <span class="text-[16px] mx-3 capitalize font-semibold">{{ router.currentRoute.value.name === 'index' ? 'dashboard' : router.currentRoute.value.name  }}</span>
        </div>
        <div class="fancy"></div>
      </header>
      <main class="p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()

const router = useRouter()
const state = reactive({
  loadSignOut: false,
  navOpen: false
})

const signOut =async () => {
  state.loadSignOut = true
  try {
    const { error } = await client.auth.signOut()
    if (error) throw error
    state.loadSignOut = false
    router.push('/login')
  } catch (error: any) {
    state.loadSignOut = false
    console.log(error.message);
  }
}

const toggleNav = () => {
  state.navOpen = !state.navOpen
}

watch(router.currentRoute, () => {
  state.navOpen = false;
});
</script>

<style lang="postcss" scoped>
.router-link-active.router-link-exact-active {
  @apply border-lime-500 text-black w-full;
}

a span:first-of-type {
  @apply mr-[6px];
}

a {
  @apply text-[#a1a1a1] transition-all py-[6px] px-6 flex items-center border-l-4 border-transparent;

  span:first-of-type {
    @apply text-2xl;
  }

  span:last-of-type {
    @apply text-sm;
  }

  &:hover {
    @apply text-black;
  }
}

.fancy {
  @apply bg-white w-6 h-6 absolute left-0 -bottom-6;

  &::after {
    content: '';
    @apply bg-neutral-50 rounded-tl-full w-6 h-6 absolute left-0 bottom-0;
  }
}
</style>
