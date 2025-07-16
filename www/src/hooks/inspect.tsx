import { useCallback } from "react";
import useSWRMutation from "swr/mutation";
import { hexToBool, hexToNumber } from "viem";
import { Address } from "viem";

const INSPECT_URL = process.env.NEXT_PUBLIC_INSPECT_URL!;

async function getCityRequest(url: string, { arg }: { arg: Address }) {
  const response = await fetch(`${url}/{"method":"getCity","address":"${arg}"}`);

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  // Modify this line depending on your expected response format:
  const json = await response.json(); // or await response.json();
  
  const map = json?.reports?.[0]?.payload;
  const stats = json?.reports?.[1]?.payload;

  if (!map || !stats) {
    return undefined;
  }

  return {
    map,
    stats,
  };
}

export const useGetCity = (address?: Address) => {
  const {
    trigger: _trigger,
    data,
    error,
    isMutating,
  } = useSWRMutation(INSPECT_URL, getCityRequest);

  // Memoize to prevent re-creating the function every render
  const trigger = useCallback(() => {
    if (!address) return;
    _trigger(address);
  }, [_trigger, address]);

  return {
    trigger,
    game: data,
    error,
    isLoading: isMutating,
  };
};

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

  // Memoize to prevent re-creating the function every render
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

async function getCityBalanceRequest(url: string, { arg }: { arg: Address }) {
  const response = await fetch(
    `${url}/{"method":"getCityBalance","address":"${arg}"}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch city balance");
  }

  const json = await response.json();
  const payload = json?.reports?.[0]?.payload;

  if (!payload) {
    throw new Error("No payload returned for city balance");
  }

  // Assuming the balance is a hex string representing a BigInt
  return hexToNumber(payload);
}

export const useGetCityBalance = (address?: Address) => {
  const {
    trigger: _trigger,
    data,
    error,
    isMutating,
  } = useSWRMutation(INSPECT_URL, getCityBalanceRequest);

  const trigger = useCallback(() => {
    if (!address) return;
    _trigger(address);
  }, [_trigger, address]);

  return {
    trigger,
    cityBalance: data,
    error,
    isLoading: isMutating,
  };
};

async function getMapFundsRequest(url: string, { arg }: { arg: Address }) {
  const response = await fetch(
    `${url}/{"method":"getMapFunds","address":"${arg}"}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  const json = await response.json();

  const map = json?.reports?.[0]?.payload;
  const funds = json?.reports?.[1]?.payload;

  if (!map || !funds) {
    return undefined;
  }

  return {
    map,
    funds,
  };
}

export const useGetMapFunds = (address?: Address) => {
  const {
    trigger: _trigger,
    data,
    error,
    isMutating,
  } = useSWRMutation(INSPECT_URL, getMapFundsRequest);

  const trigger = useCallback(() => {
    if (!address) return;
    _trigger(address);
  }, [_trigger, address]);

  return {
    trigger,
    mapFunds: data,
    error,
    isLoading: isMutating,
  };
};