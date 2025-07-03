import { SectionCards } from "@/components/cards/SectionCards";
import MusicPlayer from "@/features/music-player";
import ClientLayout from "@/layouts/ClientLayout";

export default function HomePage() {
	return (
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
	);
}
