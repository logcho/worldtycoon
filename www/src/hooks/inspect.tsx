import { useCallback } from "react";
import useSWRMutation from "swr/mutation";
import { hexToBool } from "viem";
import { Address } from "viem";

const INSPECT_URL = process.env.NEXT_PUBLIC_INSPECT_URL!;

async function hasCityRequest(url: string, { arg }: { arg: Address }) {
  const response = await fetch(
    `${url}/{"method":"hasCity","address":"${arg}"}`
  );
  const json = await response.json();

  const payload = json?.reports?.[0]?.payload;
  if (!payload) {
    throw new Error("No payload returned from inspect");
  }

  return hexToBool(payload);
}

export const useHasCity = (address?: Address) => {
  const {
    trigger: _trigger,
    data,
    error,
    isMutating,
  } = useSWRMutation(INSPECT_URL, hasCityRequest);

  // ✅ Memoize to prevent re-creating the function every render
  const trigger = useCallback(() => {
    if (!address) return;
    _trigger(address);
  }, [_trigger, address]);

  return {
    trigger,
    hasCity: data,
    error,
    isLoading: isMutating,
  };
};
