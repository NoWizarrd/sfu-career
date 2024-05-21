import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout/Layout"
import MainPage from "./pages/MainPage/MainPage"
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage"
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage"
import SearchStudentPage from "./pages/SearchPage/SearchStudentPage"
import LoginPage from "./pages/LoginPage/LoginPage"
import { QueryClient, QueryClientProvider } from "react-query"
import StudentProfile from "./pages/ProfilePage/StudentProfile"
import CompanyProfile from "./pages/ProfilePage/CompanyProfile"
import SearchVacanciesPage from "./pages/SearchPage/SearchVacanciesPage"
import VacancyDetailPage from "./pages/VacancyPage/VacancyDetailPage"
import CreateVacancyPage from "./pages/VacancyPage/CreateVacancyPage"

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
        path: "registration",
        element: <RegistrationPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "student/:profileId",
        element: <StudentProfile />,
      },
      {
        path: "company/:profileId",
        element: <CompanyProfile />,
      },
      {
        path: "vacancy/:vacancyId",
        element: <VacancyDetailPage />,
      },
      {
        path: "search/student",
        element: <SearchStudentPage />,
      },
      {
        path: "search/vacancy",
        element: <SearchVacanciesPage />,
      },
      {
        path: "/vacancy/new",
        element: <CreateVacancyPage  />,
      },
      {
        path: "notfound",
        element: <NotFoundPage />,
      },
      {
        path: "*",
        element: <Navigate to="/notfound" />,
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