import { useState } from "react";

export default function useForm(initialState) {
  const [values, setValues] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetError = () => setError("");

  return { values, setValues, error, setError, loading, setLoading, handleChange, resetError };
}
