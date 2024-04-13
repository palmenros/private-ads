<script setup lang="ts">
import AccountPicker from '@/components/AccountPicker.vue';
</script>

<template>
  <header class="sticky top-0">
    <nav class="bg-white border-gray-200 p-2 xl:py-4 xl:px-0">
      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-md">
        <div class="flex justify-center">
            <img src="@/assets/images/logo.svg" class="h-6 sm:h-9 mr-2" alt="Oasis logo" />
            <h2 class="capitalize text-xl text-primary font-bold mb-4" data-v-b83013f4="">Private Ads</h2>
        </div>

        <ul class="flex">
            <li class="mr-6">
                <RouterLink to="/"><a class="text-blue-800 hover:text-blue-600">User</a></RouterLink>
            </li>

            <li class="mr-6">
                <RouterLink to="/company"><a class="text-blue-800 hover:text-blue-600">Advertiser company</a></RouterLink>
            </li>
        </ul>

        <AccountPicker />
      </div>
    </nav>
  </header>
</template>

<style lang="postcss" scoped></style>
