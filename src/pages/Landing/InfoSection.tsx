import motherTeachingDaughter from "@/assets/mother-teaching-daughter.svg";
import thinkingMan from "@/assets/thinking-man.svg";
import { Button } from "@/components/ui/button";
import Container from "./Container";

export default function Features() {
	return (
		<Container index={1}>
			<div className="flex items-center justify-center gap-12 h-full py-20">
				{[
					{
						text: "box 1",
						image: (
							<img
								src={thinkingMan}
								alt="box 1"
								className="max-h-full max-w-full"
							/>
						),
					},
					{
						text: "box 2",
						image: (
							<img
								src={motherTeachingDaughter}
								alt="box 2"
								className="max-h-full max-w-full"
							/>
						),
					},
				].map((box) => (
					// cards
					<div
						key={box.text}
						className={`group w-full rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
					>
						<div className="flex flex-col items-center justify-center p-12 gap-12">
							<div className="h-60 w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
								{box.image}
							</div>
							<p className="text-center text-md">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua.
							</p>
							<Button className="group-hover:scale-110">Learn More</Button>
						</div>
					</div>
				))}
			</div>
		</Container>
	);
}
