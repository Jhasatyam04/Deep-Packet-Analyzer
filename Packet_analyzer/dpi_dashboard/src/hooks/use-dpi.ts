import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { dpiApi } from "@/services/dpi/client";
import type { DomainQuery, FlowQuery, RuleInput, RuleType } from "@/types/dpi";

const keys = {
  all: ["dpi"] as const,
  status: ["dpi", "status"] as const,
  stats: ["dpi", "stats"] as const,
  applications: ["dpi", "applications"] as const,
  domains: (q: DomainQuery) => ["dpi", "domains", q] as const,
  domain: (id: string) => ["dpi", "domain", id] as const,
  flows: (q: FlowQuery) => ["dpi", "flows", q] as const,
  flow: (id: string) => ["dpi", "flow", id] as const,
  rules: (type: RuleType | "all") => ["dpi", "rules", type] as const,
  threads: ["dpi", "threads"] as const,
  session: ["dpi", "session"] as const,
};

function pollMs(status?: string) {
  return status === "processing" ? 2000 : 6000;
}

export function useDebouncedValue<T>(value: T, delay = 280): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useEngineStatus() {
  return useQuery({
    queryKey: keys.status,
    queryFn: dpiApi.getStatus,
    refetchInterval: (q) => pollMs(q.state.data?.status),
  });
}

export function useStats() {
  const status = useEngineStatus();
  return useQuery({
    queryKey: keys.stats,
    queryFn: dpiApi.getStats,
    refetchInterval: pollMs(status.data?.status),
    placeholderData: keepPreviousData,
  });
}

export function useApplications() {
  const status = useEngineStatus();
  return useQuery({
    queryKey: keys.applications,
    queryFn: dpiApi.getApplications,
    refetchInterval: pollMs(status.data?.status),
    placeholderData: keepPreviousData,
  });
}

export function useDomains(query: DomainQuery) {
  const status = useEngineStatus();
  return useQuery({
    queryKey: keys.domains(query),
    queryFn: () => dpiApi.getDomains(query),
    refetchInterval: pollMs(status.data?.status),
    placeholderData: keepPreviousData,
  });
}

export function useDomain(id: string | null) {
  return useQuery({
    queryKey: keys.domain(id ?? ""),
    queryFn: () => dpiApi.getDomain(id!),
    enabled: Boolean(id),
  });
}

export function useFlows(query: FlowQuery) {
  const status = useEngineStatus();
  return useQuery({
    queryKey: keys.flows(query),
    queryFn: () => dpiApi.getFlows(query),
    refetchInterval: pollMs(status.data?.status),
    placeholderData: keepPreviousData,
  });
}

export function useFlow(id: string | null) {
  return useQuery({
    queryKey: keys.flow(id ?? ""),
    queryFn: () => dpiApi.getFlow(id!),
    enabled: Boolean(id),
  });
}

export function useRules(type: RuleType | "all" = "all") {
  const status = useEngineStatus();
  return useQuery({
    queryKey: keys.rules(type),
    queryFn: () => dpiApi.getRules(type),
    refetchInterval: pollMs(status.data?.status),
    placeholderData: keepPreviousData,
  });
}

export function useThreads() {
  const status = useEngineStatus();
  return useQuery({
    queryKey: keys.threads,
    queryFn: dpiApi.getThreads,
    refetchInterval: pollMs(status.data?.status),
    placeholderData: keepPreviousData,
  });
}

export function useSession() {
  const status = useEngineStatus();
  return useQuery({
    queryKey: keys.session,
    queryFn: dpiApi.getSession,
    refetchInterval: pollMs(status.data?.status),
    placeholderData: keepPreviousData,
  });
}

export function useInvalidateDpi() {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: keys.all });
}

export function useCreateRule() {
  const invalidate = useInvalidateDpi();
  return useMutation({
    mutationFn: (input: RuleInput) => dpiApi.createRule(input),
    onSuccess: invalidate,
  });
}

export function useUpdateRule() {
  const invalidate = useInvalidateDpi();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<RuleInput> }) =>
      dpiApi.updateRule(id, patch),
    onSuccess: invalidate,
  });
}

export function useDeleteRule() {
  const invalidate = useInvalidateDpi();
  return useMutation({
    mutationFn: (id: string) => dpiApi.deleteRule(id),
    onSuccess: invalidate,
  });
}

export function useReprocess() {
  const invalidate = useInvalidateDpi();
  return useMutation({
    mutationFn: () => dpiApi.reprocess(),
    onSuccess: invalidate,
  });
}
