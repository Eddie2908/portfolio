import { useState } from 'react';

export function useFormSubmit(submitFn, { onSuccess, onError } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await submitFn(data);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Une erreur est survenue';
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, error };
}
