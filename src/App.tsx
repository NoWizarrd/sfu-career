import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout/Layout"
import MainPage from "./pages/MainPage/MainPage"
import AuthorizationPage from "./pages/AuthorizationPage/AuthorizationPage"
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import SearchPage from "./pages/SearchPage/SearchPage"


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