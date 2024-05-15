import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout/Layout"
import MainPage from "./pages/MainPage/MainPage"
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage"
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import SearchPage from "./pages/SearchPage/SearchPage"
import LoginPage from "./pages/LoginPage/LoginPage"
import { QueryClient, QueryClientProvider } from "react-query"
import checkAuth from "./scripts/checkAuth"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: checkAuth() ? <SearchPage /> : <MainPage />,
      },
      {
        path: "registration",
        element: <RegistrationPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "notfound",
        element: <NotFoundPage />,
      },
      {
        path: "profile/:profileId",
        element: <ProfilePage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
    ],
  },
])

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
      
  )
}