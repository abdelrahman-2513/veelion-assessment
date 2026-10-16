"use client";

import { useCallback, useEffect, useState } from "react";
import type { ErrorResponse, TasksSummary } from "@/types/api";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

async function requestTasksSummary(): Promise<TasksSummary> {
  const response = await fetch("/api/reports/tasks-summary");

  if (!response.ok) {
    let message = `Request failed with ${response.status}`;

    try {
      const body = (await response.json()) as ErrorResponse;
      if (body.error?.message) {
        message = body.error.message;
      }
    } catch {
      // Keep the status message when the body is not JSON.
    }

    throw new Error(message);
  }

  return (await response.json()) as TasksSummary;
}

export function useTasksSummary() {
  const [summary, setSummary] = useState<TasksSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const body = await requestTasksSummary();
      setSummary(body);
    } catch (error) {
      setSummary(null);
      setError(getErrorMessage(error, "Could not load the report right now."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    fetchSummary,
  };
}