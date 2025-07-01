import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import prepPlayLogo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PrivacyProlicyModal from "./modals/privacy-policy-modal";

const menuItems = [
	{ name: "How it works", href: "/" },
	{ name: "About", href: "/" },
	{ name: "Privacy Policy", href: "/" },
];

export default function Navbar() {
	const [menuState, setMenuState] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav
			data-state={menuState && "active"}
			className="fixed z-20 w-full px-2 group"
		>
			<div
				className={cn(
					"mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
					isScrolled &&
						"bg-white/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5 shadow-md",
				)}
			>
				<div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
					<div className="flex w-full justify-between lg:w-auto">
						<a
							href="/"
							aria-label="home"
							className="flex items-center space-x-2"
						>
							<img src={prepPlayLogo} alt="logo" className="h-8 w-8" />
							<div className="leading-0">
								<p className="font-bold text-lg">Prep Play</p>
								<span className="text-sm">Consultancy</span>
							</div>
						</a>
						<button
							type="button"
							onClick={() => setMenuState((s) => !s)}
							aria-label={menuState ? "Close Menu" : "Open Menu"}
							className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
						>
							<Menu
								className={cn(
									"m-auto size-6 duration-200",
									menuState && "rotate-180 scale-0 opacity-0",
								)}
							/>
							<X
								className={cn(
									"absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200",
									menuState && "rotate-0 scale-100 opacity-100",
								)}
							/>
						</button>
					</div>

					{/* Desktop menu */}
					<div className="absolute inset-0 m-auto hidden size-fit lg:block">
						<ul className="flex gap-8 text-sm ">
							{menuItems.map((item) => {
								const isPrivacyPolicy = item.name === "Privacy Policy";
								return (
									<li
										key={item.name}
										className="text-zinc-500 hover:text-zinc-900 block duration-150"
									>
										{isPrivacyPolicy ? (
											<PrivacyProlicyModal />
										) : (
											<a href={item.href}>
												<span>{item.name}</span>
											</a>
										)}
									</li>
								);
							})}
						</ul>
					</div>

					{/* Mobile menu and buttons */}
					<div
						className={cn(
							"bg-white group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent",
							menuState && "block",
						)}
					>
						<div className="lg:hidden">
							<ul className="space-y-6 text-base">
								{menuItems.map((item) => (
									<li key={item.name}>
										<a
											href={item.href}
											className="text-zinc-500 hover:text-zinc-900 block duration-150"
										>
											<span>{item.name}</span>
										</a>
									</li>
								))}
							</ul>
						</div>
						<div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
							<Button
								variant="outline"
								size="sm"
								className={cn(isScrolled && "lg:hidden")}
							>
								<a href="/login">
									<span>Login</span>
								</a>
							</Button>
							<Button size="sm" className={cn(isScrolled && "lg:hidden")}>
								<a href="/signup">
									<span>Sign Up</span>
								</a>
							</Button>
							<Button
								size="sm"
								className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
							>
								<a href="/get-started">
									<span>Get Started</span>
								</a>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
