import { useState } from 'react';

type FormSubmitOptions<TResult> = {
  onSuccess?: (result: TResult) => void;
  onError?: (message: string) => void;
};

type SubmitError = {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message?: string;
};

export function useFormSubmit<TData, TResult>(
  submitFn: (data: TData) => Promise<TResult>,
  { onSuccess, onError }: FormSubmitOptions<TResult> = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: TData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await submitFn(data);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err as SubmitError;
      const msg = error.response?.data?.detail || error.message || 'Une erreur est survenue';
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, error };
}
