<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Network, useEthereumStore } from '../stores/ethereum';
import AppButton from '@/components/AppButton.vue';
import { retry } from '@/utils/promise';

// Placeholder implementation for useCompanyAdBox
function useCompanyAdBox() {
  return {
    async amount() {
      // Placeholder implementation for fetching amount
      return 100;
    },
    async content() {
      // Placeholder implementation for fetching content
      return 'Sample content';
    },
    async author() {
      // Placeholder implementation for fetching author
      return 'Sample author';
    },
    async setCompanyAd(amount: number, content: string) {
      // Placeholder implementation for setting company ad
      console.log('Setting company ad:', { amount, content });
    }
  };
}

const eth = useEthereumStore();
const companyAdBox = useCompanyAdBox();
const errors = ref<string[]>([]);
const newAmount = ref(0);
const newContent = ref('');
const isSettingCompanyAd = ref(false);
const isCorrectNetworkSelected = ref<Boolean>(true);

function handleError(error: Error, errorMessage: string) {
  errors.value.push(`${errorMessage}: ${error.message ?? JSON.stringify(error)}`);
  console.error(error);
}

async function fetchAndSetCompanyAdValues() {
  let retrievedCompanyAd = null;

  try {
    const amount = await companyAdBox.amount();
    const content = await companyAdBox.content();

    newAmount.value = amount;
    newContent.value = content;
  } catch (e) {
    handleError(e as Error, 'Failed to get company ad');
  }
}

async function setCompanyAd(e: Event) {
  if (e.target instanceof HTMLFormElement) {
    e.target.checkValidity();
    if (!e.target.reportValidity()) return;
  }

  e.preventDefault();

  try {
    const amount = newAmount.value;
    const content = newContent.value;
    errors.value.splice(0, errors.value.length);
    isSettingCompanyAd.value = true;

    await companyAdBox.setCompanyAd(amount, content);

    await retry(fetchAndSetCompanyAdValues);
  } catch (e: any) {
    handleError(e, 'Failed to set company ad');
  } finally {
    isSettingCompanyAd.value = false;
  }
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
  await fetchAndSetCompanyAdValues();
});
</script>


<template>
  <section class="pt-5" v-if="isCorrectNetworkSelected">
    <h2 class="capitalize text-xl text-white font-bold mb-4">Set company ad</h2>
    <p class="text-base text-white mb-10">
      Set your new company ad by filling the form below.
    </p>

    <form @submit="setCompanyAd">
      <div class="form-group">
        <input
          type="number"
          id="newAmount"
          class="peer"
          placeholder=" "
          v-model="newAmount"
          required
          :disabled="isSettingCompanyAd"
        />
        <label
          for="newAmount"
          class="peer-focus:text-primaryDark peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5"
        >
          New amount:
          <span class="text-red-500">*</span>
        </label>
      </div>

      <div class="form-group">
        <input
          type="text"
          id="newContent"
          class="peer"
          placeholder=" "
          v-model="newContent"
          required
          :disabled="isSettingCompanyAd"
        />
        <label
          for="newContent"
          class="peer-focus:text-primaryDark peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5"
        >
          New content:
          <span class="text-red-500">*</span>
        </label>
      </div>

      <AppButton type="submit" variant="primary" :disabled="isSettingCompanyAd">
        <span v-if="isSettingCompanyAd">Setting…</span>
        <span v-else>Set Company Ad</span>
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
      below "Switch network" button
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