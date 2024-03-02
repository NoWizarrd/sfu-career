import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout/Layout"
import MainPage from "./pages/MainPage"
import AuthorizationPage from "./pages/AuthorizationPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProfilePage from "./pages/ProfilePage"
import SearchPage from "./pages/SearchPage"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "authorization",
        element: <AuthorizationPage />,
      },
      {
        path: "notfound",
        element: <NotFoundPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
    ],
  },
])

export default function App() {
  return (
      <RouterProvider router={router} />
  )
}