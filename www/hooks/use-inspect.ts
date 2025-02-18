import { useQuery } from "@tanstack/react-query";

import type { Address, Hex } from "viem";

import { env } from "~/lib/env";

export enum InspectStatus {
  Accepted = "Accepted",
  Rejected = "Rejected",
  Exception = "Exception",
  MachineHalted = "MachineHalted",
  CycleLimitExceeded = "CycleLimitExceeded",
  TimeLimitExceeded = "TimeLimitExceeded",
}

export type InspectReport = {
  payload: Hex;
};

export type InspectMetadata = {
  active_epoch_index: number;
  current_input_index: number;
};

export type InspectResponse = {
  status: InspectStatus;
  exception_payload: string;
  reports: InspectReport[];
  metadata: InspectMetadata;
};

type UseInspectResult = {
  data?: InspectResponse | null;
  isLoading: boolean;
  error: unknown;
};

export const useInspect = (
  key: string | null,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  },
): UseInspectResult => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["inspect", key],
    queryFn: async () => {
      if (!key) return null;

      const response = await fetch(`${env.NEXT_PUBLIC_INSPECT_URL}/${key}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json() as Promise<InspectResponse>;
    },
    enabled: !!key && options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
  });

  return {
    data,
    isLoading,
    error,
  };
};


