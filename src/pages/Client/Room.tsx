import { useState } from "react";
import type { CreateSessionPayload } from "@/api/sessions";
import { createSession } from "@/api/sessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAvatar } from "@/context/AvatarContext";
import AvatarCharacter from "@/features/avatar-character";
import { useAuth } from "@/hooks/useAuth";

const steps = ["Child Data", "Avatar Data", "Emotional Expression"];

export default function Room() {
	const [step, setStep] = useState(0);
	const { avatar, setAvatar } = useAvatar();
	const { user } = useAuth();

	// Stage 1 interaction states
	const [showChildForm, setShowChildForm] = useState(false);
	const [avatarMessage, setAvatarMessage] = useState(
		"Hello! Let's have some fun together.",
	);

	// Example state for form fields
	const [childData, setChildData] = useState({
		first_name: "",
		last_name: "",
		age: "",
		birthday: "",
		place_of_birth: "",
	});
	const [avatarData, setAvatarData] = useState({
		head: "default",
		hair: "default",
	});
	const [emotion, setEmotion] = useState("neutral");
	// Add more states as needed for emotional_expression, session_notes, tags, etc.
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Handlers for updating avatar state
	const handleAvatarChange = (field: "head" | "hair", value: string) => {
		setAvatarData((prev) => ({ ...prev, [field]: value }));
		setAvatar((prev) => ({ ...prev, [field]: value }));
	};
	const handleEmotionChange = (value: string) => {
		setEmotion(value);
		setAvatar((prev) => ({ ...prev, emotion: value }));
	};

	// Handler for 'Got it!' in stage 1
	const handleGotIt = () => {
		setAvatarMessage("Great! What's your name and age?");
		setShowChildForm(true);
	};

	const handleFinish = async () => {
		if (!user) return;
		setLoading(true);
		setError(null);
		try {
			const payload: CreateSessionPayload = {
				social_worker_id: user.id,
				title: "Session Title", // You may want to collect this in a step
				child_data: {
					first_name: childData.first_name,
					last_name: childData.last_name,
					age: Number(childData.age),
					birthday: childData.birthday || "2015-05-10", // Placeholder or collect from user
					place_of_birth: childData.place_of_birth || "Malolos City", // Placeholder or collect from user
				},
				avatar_data: avatarData,
				emotional_expression: {
					method: "drawing",
					drawing_data: "base64encodedstringhere", // Placeholder
					selected_feelings: [emotion],
					body_map_annotations: [],
				},
				session_notes: "", // Collect from user in a step
				tags: [], // Collect from user in a step
				stage: "Stage 1",
			};
			await createSession(payload);
			// Optionally redirect or show success message
		} catch (err: any) {
			setError(err.message || "Failed to create session");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto rounded-xl shadow-lg p-8">
			<div className="flex flex-col md:flex-row md:items-start gap-8">
				{/* Avatar and speech bubble */}
				<div className="flex-shrink-0 flex justify-center md:justify-start md:w-1/3">
					<AvatarCharacter
						message={avatarMessage}
						showNext={!showChildForm}
						onNext={handleGotIt}
						bubblePosition="left"
						size="2xl"
					/>
				</div>
				{/* Form and stepper */}
				<div className="flex-1 w-full">
					<div className="flex items-center justify-between mb-6 mt-4 md:mt-0">
						{steps.map((label, idx) => (
							<div
								key={label}
								className={`flex-1 text-center ${idx === step ? "font-bold text-blue-600" : "text-gray-400"}`}
							>
								{label}
							</div>
						))}
					</div>
					{error && <div className="text-red-500 mb-2">{error}</div>}
					{step === 0 && (
						<div className="space-y-6">
							{showChildForm && (
								<Card className="w-full">
									<CardContent className="pt-6 space-y-4">
										<div>
											<Label htmlFor="first_name">First Name</Label>
											<Input
												id="first_name"
												placeholder="First Name"
												value={childData.first_name}
												onChange={(e) =>
													setChildData({
														...childData,
														first_name: e.target.value,
													})
												}
											/>
										</div>
										<div>
											<Label htmlFor="last_name">Last Name</Label>
											<Input
												id="last_name"
												placeholder="Last Name"
												value={childData.last_name}
												onChange={(e) =>
													setChildData({
														...childData,
														last_name: e.target.value,
													})
												}
											/>
										</div>
										<div>
											<Label htmlFor="age">Age</Label>
											<Input
												id="age"
												placeholder="Age"
												value={childData.age}
												onChange={(e) =>
													setChildData({ ...childData, age: e.target.value })
												}
												type="number"
												min="1"
											/>
										</div>
										<div className="flex justify-end">
											<Button
												type="button"
												className="px-4 py-2"
												onClick={() => setStep(1)}
												disabled={
													!childData.first_name ||
													!childData.last_name ||
													!childData.age
												}
											>
												Next
											</Button>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					)}
					{/* The rest of the steps remain as before, only shown if step > 0 */}
					{step === 1 && (
						<Card className="w-full">
							<CardContent className="pt-6 space-y-4">
								<h2 className="text-xl font-semibold">Avatar Data</h2>
								<div>
									<Label htmlFor="avatar_head">Head</Label>
									<select
										id="avatar_head"
										className="border p-2 rounded w-full"
										value={avatarData.head}
										onChange={(e) => handleAvatarChange("head", e.target.value)}
									>
										<option value="default">Default</option>
										<option value="round">Round</option>
										<option value="oval">Oval</option>
									</select>
								</div>
								<div>
									<Label htmlFor="avatar_hair">Hair</Label>
									<select
										id="avatar_hair"
										className="border p-2 rounded w-full"
										value={avatarData.hair}
										onChange={(e) => handleAvatarChange("hair", e.target.value)}
									>
										<option value="default">Default</option>
										<option value="short_black">Short Black</option>
										<option value="long_blonde">Long Blonde</option>
									</select>
								</div>
								<div className="flex justify-between mt-8">
									<Button
										type="button"
										variant="outline"
										onClick={() => setStep(0)}
									>
										Back
									</Button>
									<Button
										type="button"
										className="px-4 py-2"
										onClick={() => setStep(2)}
									>
										Next
									</Button>
								</div>
							</CardContent>
						</Card>
					)}
					{step === 2 && (
						<Card className="w-full">
							<CardContent className="pt-6 space-y-4">
								<h2 className="text-xl font-semibold">Emotional Expression</h2>
								<div>
									<Label htmlFor="emotion_select">Emotion</Label>
									<select
										id="emotion_select"
										className="border p-2 rounded w-full"
										value={emotion}
										onChange={(e) => handleEmotionChange(e.target.value)}
									>
										<option value="neutral">Neutral</option>
										<option value="happy">Happy</option>
										<option value="nervous">Nervous</option>
										<option value="sad">Sad</option>
									</select>
								</div>
								<div className="flex justify-between mt-8">
									<Button
										type="button"
										variant="outline"
										onClick={() => setStep(1)}
									>
										Back
									</Button>
									<Button
										type="button"
										className="px-4 py-2"
										onClick={handleFinish}
										disabled={loading}
									>
										{loading ? "Saving..." : "Finish"}
									</Button>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
