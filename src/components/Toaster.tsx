import { lazy, Suspense } from "react";

const ToastContainer = lazy(async () => {
  const [{ ToastContainer }] = await Promise.all([
    import("react-toastify"),
    import("react-toastify/dist/ReactToastify.css"),
  ]);
  return { default: ToastContainer };
});

export function Toaster() {
  return (
    <Suspense fallback={null}>
      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
    </Suspense>
  );
}
