import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/Client/HomePage";
import LandingPage from "@/pages/Landing";

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/client/home" element={<HomePage />} />
		</Routes>
	);
}
