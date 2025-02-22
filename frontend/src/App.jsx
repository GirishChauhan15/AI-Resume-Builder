import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import AuthLayout from "./AuthLayout";
import Protected from "./Protected";
import { lazy, Suspense } from "react";
import { NotFound } from "./components/customComponents/index";
const EditResume = lazy(()=>import("./components/customComponents/resume/EditResume"));
const Pdf = lazy(()=> import("./components/customComponents/Pdf"));

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
          <Route element={<AuthLayout />}>
            <Route path="" element={<Home />} />
            <Route
              errorElement={<NotFound />}
              path="dashboard/resume/:resumeId/edit"
              element={
                <Protected authentication>
                  <Suspense fallback={<h2>Loading....</h2>}>
                  <EditResume />
                  </Suspense>
                </Protected>
              }
              />
            <Route
              errorElement={<NotFound />}
              path="my-resume/:resumeId/view"
              element={
                <Protected authentication>
                  <Suspense fallback={<h2>Loading....</h2>}>
                  <Pdf />
                  </Suspense>
                </Protected>
              }
              />
            <Route
              path="auth"
              element={
                <Protected authentication={false}>
                  <Auth />
                </Protected>
              }
              />
          </Route>
          <Route
            errorElement={<NotFound />}
            path="resume/:resumeId/view"
            element={
              <Suspense fallback={<h2>Loading....</h2>}>
            <Pdf />
            </Suspense>

            }
            />
          <Route path="*" element={
            <NotFound />
          } />
        </Route>
    )
  );

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
