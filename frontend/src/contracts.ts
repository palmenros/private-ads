import type { ComputedRef } from 'vue';
import { computed } from 'vue';

import { type AdManager, AdManager__factory } from '../../backend/typechain-types/index';
export type { AdManager } from '../../backend/typechain-types/index';

import { useEthereumStore } from './stores/ethereum';
import { type ContractRunner, VoidSigner } from 'ethers';

const addr = import.meta.env.VITE_MESSAGE_BOX_ADDR!;

export function useAdManager(): ComputedRef<AdManager | null> {
  const eth = useEthereumStore();

  return computed(() => {
    if (!eth) {
      console.error('[useMessageBox] Ethereum Store not initialized');
      return null;
    }

    if (!eth.signer) {
      console.error('[useMessageBox] Signer is not initialized');
      return null;
    }

    return AdManager__factory.connect(addr, eth.signer as ContractRunner);
  });
}

function initializeSigner(eth: ReturnType<typeof useEthereumStore>) {
  let signer = eth.unwrappedSigner;
  if (!signer && eth.unwrappedProvider) {
    signer = new VoidSigner(eth.address!, eth.unwrappedProvider);
  }
  return signer;
}

export function useUnwrappedAdManager(): ComputedRef<AdManager | null> {
  const eth = useEthereumStore();
  return computed(() => {
    if (!eth) {
      console.error('[useMessageBox] Ethereum Store not initialized');
      return null;
    }

    const signer = initializeSigner(eth);
    if (!signer) {
      console.error('[useMessageBox] Signer not initialized');
      return null;
    }

    return AdManager__factory.connect(addr, signer);
  });
}
