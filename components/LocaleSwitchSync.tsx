"use client";

import { useEffect } from "react";

import { useSiteContext, type LocaleSwitchPaths } from "@/lib/site-context";

type LocaleSwitchSyncProps = {
  paths: LocaleSwitchPaths;
};

export default function LocaleSwitchSync({ paths }: LocaleSwitchSyncProps) {
  const { setLocaleSwitchPaths } = useSiteContext();

  useEffect(() => {
    setLocaleSwitchPaths(paths);
    return () => setLocaleSwitchPaths(null);
  }, [paths, setLocaleSwitchPaths]);

  return null;
}
