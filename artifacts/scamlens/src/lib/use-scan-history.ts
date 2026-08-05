import { useCallback, useEffect, useState } from 'react';
import type { ScanResult } from './scam-analysis';

const STORAGE_KEY = 'scamlens-history-v1';

export function useScanHistory() {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved) as ScanResult[]);
    } catch {
      setHistory([]);
    } finally {
      setReady(true);
    }
  }, []);

  const persist = useCallback((next: ScanResult[]) => {
    setHistory(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 30)));
  }, []);

  const addScan = useCallback((scan: ScanResult) => persist([scan, ...history]), [history, persist]);
  const removeScan = useCallback((id: string) => persist(history.filter((scan) => scan.id !== id)), [history, persist]);
  const clearHistory = useCallback(() => persist([]), [persist]);

  return { history, ready, addScan, removeScan, clearHistory };
}