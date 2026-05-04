import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      {/* Toast global */}
      <Toaster position="top-center" richColors />

      {/* Router */}
      <RouterProvider router={router} />
    </>
  );
}