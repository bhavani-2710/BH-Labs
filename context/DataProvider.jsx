"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const DataContext = createContext();
const API = process.env.NEXT_PUBLIC_API_URL || "/api";

export function DataProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [subjectSpecificExperiments, setSubjectSpecificExperiments] = useState([]);
  const [codeStore, setCodeStore] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, e] = await Promise.all([
          fetch(`${API}/subjects`),
          fetch(`${API}/experiments`),
        ]);
        if (!s.ok || !e.ok) throw new Error("Failed to load data");
        setSubjects(await s.json());
        setExperiments(await e.json());
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSaveCode = useCallback((expId, part, codeContent) => {
    setCodeStore((prev) => ({ ...prev, [`${expId}_${part}`]: codeContent }));
  }, []);

  const fetchSubjectExperiments = useCallback(async (subjectId) => {
    if (!subjectId) return;
    try {
      const res = await fetch(`${API}/experiments/subject/${subjectId}`);
      if (res.ok) setSubjectSpecificExperiments(await res.json());
    } catch (err) {
      console.error("Failed to fetch subject experiments:", err);
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        subjects, experiments, subjectSpecificExperiments, setSubjectSpecificExperiments,
        codeStore, handleSaveCode, fetchSubjectExperiments, loading, error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
