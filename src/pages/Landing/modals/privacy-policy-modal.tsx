import { useEffect, useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

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
						PrepPlay is committed to maintaining the highest standards of
						confidentiality and data security. All information shared within the
						app is securely encrypted and accessible only to authorized
						personnel. Children’s identities and personal details are
						safeguarded at every step, and no data is shared with third parties
						without explicit, informed consent and legal compliance.
					</DialogDescription>
					<DialogTitle>Policy Statement</DialogTitle>
					<DialogDescription>
						PrepPlay adheres to a strict code of ethical practice rooted in
						child-centered and trauma-informed care. The application is designed
						to respect each child’s autonomy, dignity, and privacy, providing
						interviewers with secure tools and protocols while prioritizing the
						well-being and safety of every user throughout their engagement with
						the platform.
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
