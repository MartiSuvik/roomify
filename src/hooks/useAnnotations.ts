import { useState, useEffect } from 'react';
import { Annotation } from '@/types';

const STORAGE_KEY = 'roomify-annotations';

export function useAnnotations() {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAnnotations(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored annotations:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
  }, [annotations]);

  const addAnnotation = (annotation: Omit<Annotation, 'id'>) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: Date.now().toString(),
    };
    setAnnotations(prev => [...prev, newAnnotation]);
    return newAnnotation;
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
  };

  const clearAnnotations = () => {
    setAnnotations([]);
  };

  return {
    annotations,
    addAnnotation,
    deleteAnnotation,
    clearAnnotations,
  };
}