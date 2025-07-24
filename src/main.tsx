import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import AppRoutes from "./routes/AppRoutes.tsx";

const queryClient = new QueryClient();

const rootEl = document.getElementById("root");
if (rootEl) {
	createRoot(rootEl).render(
		<StrictMode>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<AppRoutes />
						<Toaster />
					</AuthProvider>
				</QueryClientProvider>
			</BrowserRouter>
		</StrictMode>,
	);
}
