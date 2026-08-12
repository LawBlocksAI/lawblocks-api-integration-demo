import { useRoutes } from "react-router-dom";
import Layout from "../components/Layout";
import UploadPage from "../pages/UploadPage";
import DocumentsPage from "../pages/DocumentsPage";
import SignPage from "../pages/SignPage";
import GenerateDocumentPage from "../pages/GenerateDocumentPage";
import useTheme from "../hooks/useTheme";
import { ROUTES } from "../utils/routeConstants";

export default function AppRoutes() {
  const { theme } = useTheme();

  const routes = useRoutes([
    {
      path: ROUTES.HOME,
      element: <Layout />,
      children: [
        { path: ROUTES.HOME, element: <UploadPage theme={theme} /> },
        { path: ROUTES.GENERATE, element: <GenerateDocumentPage theme={theme} /> },
        { path: ROUTES.DOCUMENTS, element: <DocumentsPage theme={theme} /> },
        { path: ROUTES.SIGN, element: <SignPage theme={theme} /> },
      ],
    },
  ]);

  return routes;
}
