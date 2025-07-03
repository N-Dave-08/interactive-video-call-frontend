import { useEffect, useState } from "react";
import { Avatar3D } from "@/components/Avatar3D";
import { SectionCards } from "@/components/cards/SectionCards";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import MusicPlayer from "@/features/music-player";
import ClientLayout from "@/layouts/ClientLayout";

export default function HomePage() {
	const [open, setOpen] = useState(false);
	useEffect(() => {
		setOpen(false);
	}, []);
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-2xl w-full h-[500px] flex items-center justify-center">
					<Avatar3D />
				</DialogContent>
			</Dialog>
			<ClientLayout>
				<div className="flex w-full">
					<div className="flex-1">
						<SectionCards />
					</div>
					<div className="flex justify-end w-1/5 mr-4">
						<div className="w-full">
							<p>Background Image</p>

							{/* Music Player */}
							<MusicPlayer token="BQCJCGtb9hOvdLlUz2r6jpj-8coFNm_Xj7qoj3Xss_QDFYKmZgGD9V80gcq2jGtLcu1Zg5k2nrDP-9X_LbXw3T9MVccDBeMfp00un3bV1KwwS6FdgdFuR0SeOdEpQ71Rx1V9_GY6k7gnSsZlh1SDMA4PhQFvi3tqgmiZbf45UT3aV6__unTfSNdXgBTokzisEe2sZx6vv74m0rr8_c_8aPSDDVNKUSQtO695xJ9aGto03CUIj7NvvXVTL_43ZVnKZoBBEw1A" />
						</div>
					</div>
				</div>
			</ClientLayout>
		</>
	);
}
