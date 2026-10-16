"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ActivityLog, ErrorResponse } from "@/types/api";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

async function requestActivity(): Promise<ActivityLog[]> {
  const response = await fetch("/api/activity");

  if (!response.ok) {
    let message = `Request failed with ${response.status}`;

    try {
      const body = (await response.json()) as ErrorResponse;
      if (body.error?.message) {
        message = body.error.message;
      }
    } catch {
    }

    throw new Error(message);
  }

  const body: unknown = await response.json();
  if (!Array.isArray(body)) {
    throw new Error("Activity response was not a list.");
  }

  return body as ActivityLog[];
}

function compareNewestFirst(a: ActivityLog, b: ActivityLog): number {
  const aTime = Date.parse(a.when);
  const bTime = Date.parse(b.when);
  const aValue = Number.isNaN(aTime) ? 0 : aTime;
  const bValue = Number.isNaN(bTime) ? 0 : bTime;
  return bValue - aValue;
}

export function useActivity() {
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const logs = await requestActivity();
      setActivity([...logs].sort(compareNewestFirst));
    } catch (error) {
      setError(getErrorMessage(error, "Could not load activity right now."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const filteredActivity = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) {
      return activity;
    }

    return activity.filter((item) => {
      const action = (item.action || "").toLowerCase();
      const info = (item.info || "").toLowerCase();
      return action.includes(text) || info.includes(text);
    });
  }, [activity, query]);

  return {
    activity,
    filteredActivity,
    query,
    setQuery,
    loading,
    error,
    fetchActivity,
  };
}