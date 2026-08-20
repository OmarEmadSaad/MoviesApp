import { lazy, Suspense, useEffect, useState } from "react";

const ToastContainer = lazy(async () => {
  const [{ ToastContainer }] = await Promise.all([
    import("react-toastify"),
    import("react-toastify/dist/ReactToastify.css"),
  ]);
  return { default: ToastContainer };
});

export function Toaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
    </Suspense>
  );
}
