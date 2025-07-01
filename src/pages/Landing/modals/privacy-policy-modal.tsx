import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function PrivacyProlicyModal() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(false);
	}, []);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>Privacy Policy</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Privacy Policy</DialogTitle>
					<DialogDescription>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat. Duis aute irure dolor in
						reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
						pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
						culpa qui officia deserunt mollit anim id est laborum.
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center gap-3">
					<Checkbox id="terms" />
					<Label htmlFor="terms">Accept Terms and Conditions</Label>
				</div>
			</DialogContent>
		</Dialog>
	);
}
