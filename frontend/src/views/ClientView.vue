<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useMessageBox, useUnwrappedMessageBox } from '../contracts';
import { Network, useEthereumStore } from '../stores/ethereum';
import { abbrAddr } from '@/utils/utils';
import AppButton from '@/components/AppButton.vue';
import MessageLoader from '@/components/MessageLoader.vue';
import JazzIcon from '@/components/JazzIcon.vue';
import { retry } from '@/utils/promise';

const eth = useEthereumStore();
const messageBox = useMessageBox();
const uwMessageBox = useUnwrappedMessageBox();

const errors = ref<string[]>([]);
const message = ref('');
const author = ref('');
const newMessage = ref('');
const isLoading = ref(true);
const isSettingMessage = ref(false);
const isCorrectNetworkSelected = ref<Boolean>(true);

interface User {
  name: string;
  country: string;
  puntuation: number;
}

function handleError(error: Error, errorMessage: string) {
  errors.value.push(`${errorMessage}: ${error.message ?? JSON.stringify(error)}`);
  console.error(error);
}

async function switchNetwork() {
  await eth.switchNetwork(Network.FromConfig);
}

async function connectAndSwitchNetwork() {
  await eth.connect();
  isCorrectNetworkSelected.value = await eth.checkIsCorrectNetwork();
  if (!isCorrectNetworkSelected.value) {
    await switchNetwork();
  }
  isCorrectNetworkSelected.value = await eth.checkIsCorrectNetwork();
}

onMounted(async () => {
  await connectAndSwitchNetwork();
});

const user = ref<User>({
  name: '',
  country: '',
  puntuation: 0
});
const isSettingUser = ref(false);

function setUser() {
  // Validation
  if (!user.value.name || !user.value.country || user.value.puntuation < 0) {
    // Handle validation error
    return;
  }

  isSettingUser.value = true;

  // Simulate asynchronous request
  setTimeout(() => {
    console.log('User details updated:', user.value);
    isSettingUser.value = false;
  }, 1000);
}

function toggleUserInfo() {
      var userInfo = document.getElementById("userInfo");
      userInfo.style.display = userInfo.style.display === "none" ? "block" : "none";
    }

</script>

<template>
  <section class="pt-5" v-if="isCorrectNetworkSelected">

    <h2 class="capitalize text-xl text-white font-bold mb-4">Ad displayed</h2>

    <div class="message p-6 mb-6 rounded-xl border-2 border-gray-300" v-if="!isLoading">
      <div class="flex items-center justify-between">
        <h2 class="text-lg lg:text-lg m-0">{{ message }}</h2>
        <div class="flex items-center flex-shrink-0">
          <JazzIcon class="mr-2" :size="20" :address="author" />
          <abbr :title="author" class="font-mono block no-underline">{{ abbrAddr(author) }}</abbr>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="message p-6 pt-4 mb-6 rounded-xl border-2 border-gray-300">
        <MessageLoader />
      </div>
    </div>

    <h2 class="capitalize text-xl text-white font-bold mb-4">Set your personal information</h2>
    <p class="text-base text-white mb-10">
      Set your information to receive custom ads.
    </p>

    <form @submit="setUser">
    <div class="form-group">
      <input
        type="text"
        id="newName"
        class="peer"
        placeholder=" "
        v-model="user.name"
        required
        :disabled="isSettingCompanyAd"
      />
      <label
        for="newName"
        class="peer-focus:text-primaryDark peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5"
      >
        New name:
        <span class="text-red-500">*</span>
      </label>
    </div>

    <div class="form-group">
      <input
        type="text"
        id="newCountry"
        class="peer"
        placeholder=" "
        v-model="user.country"
        required
        :disabled="isSettingCompanyAd"
      />
      <label
        for="newCountry"
        class="peer-focus:text-primaryDark peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5"
      >
        New country:
        <span class="text-red-500">*</span>
      </label>
    </div>

    <div class="form-group">
      <input
        type="number"
        id="newPuntuation"
        class="peer"
        placeholder=" "
        v-model="user.puntuation"
        required
        :disabled="isSettingCompanyAd"
      />
      <label
        for="newPuntuation"
        class="peer-focus:text-primaryDark peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5"
      >
        New puntuation:
        <span class="text-red-500">*</span>
      </label>
    </div>

    <AppButton type="submit" variant="primary" :disabled="isSettingCompanyAd">
      <span v-if="isSettingCompanyAd">Setting…</span>
      <span v-else>Set User</span>
    </AppButton>

      <div v-if="errors.length > 0" class="text-red-500 px-3 mt-5 rounded-xl-sm">
        <span class="font-bold">Errors:</span>
        <ul class="list-disc px-8">
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
    </form>

  </section>
  <section class="pt-5" v-else>
    <h2 class="capitalize text-white text-2xl font-bold mb-4">Invalid network detected</h2>
    <p class="text-white text-base mb-20">
      In order to continue to use the app, please switch to the correct chain, by clicking on the
      bellow "Switch network" button
    </p>

    <div class="flex justify-center">
      <AppButton variant="secondary" @click="switchNetwork">Switch network</AppButton>
    </div>
  </section>
</template>

<style scoped lang="postcss">
input {
  @apply block my-4 p-1 mx-auto text-3xl border border-gray-400 rounded-xl;
}

.form-group {
  @apply relative mb-6;
}

.form-group input,
textarea {
  @apply block rounded-xl py-6 px-5 w-full text-base text-black appearance-none focus:outline-none focus:ring-0 bg-white;
}

.form-group label {
  @apply absolute text-base text-primaryDark duration-300 transform -translate-y-5 scale-75 top-6 z-10 origin-[0] left-5;
}

.message {
  @apply bg-white rounded-xl border-primary;
  border-width: 3px;
  border-style: solid;
  box-shadow: 0 7px 7px 0 rgba(0, 0, 0, 0.17);
}
</style>
