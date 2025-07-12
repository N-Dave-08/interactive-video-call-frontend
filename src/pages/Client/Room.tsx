import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { CreateSessionPayload } from "@/api/sessions";
import { createSession } from "@/api/sessions";
import AvatarCharacter from "@/features/avatar-character";
import { useAuth } from "@/hooks/useAuth";
import { useSessionStore } from "@/store/sessionStore";
import VerticalStepper from "./components/VerticalStepper";
import Stage1ChildData from "./stages/Stage1ChildData";
import Stage2AvatarData from "./stages/Stage2AvatarData";
import Stage3VideoMinigames from "./stages/Stage3VideoMinigames";
import Stage4Other from "./stages/Stage4Other";
import Stage5EmotionalExpressions from "./stages/Stage5EmotionalExpressions";
import Stage6SessionNotesTags from "./stages/Stage6SessionNotesTags";

const steps = [
	"Child Data",
	"Avatar Data",
	"Video & Minigames",
	"Stage 4",
	"Emotional Expressions",
	"Session Notes & Tags",
];

export default function Room() {
	const [step, setStep] = useState(0);
	const { user } = useAuth();
	const sessionTitle = useSessionStore((state) => state.title);

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
	const [sessionNotes, setSessionNotes] = useState("");
	const [tagsInput, setTagsInput] = useState("");

	// Handler for 'Got it!' in stage 1
	const handleGotIt = () => {
		setAvatarMessage("Great! What's your name and age?");
		setShowChildForm(true);
	};

	const handleChildDataNext = async () => {
		if (!user) return;
		setLoading(true);
		setError(null);
		try {
			const payload: CreateSessionPayload = {
				social_worker_id: user.id,
				title: sessionTitle,
				child_data: { ...childData, age: Number(childData.age) },
				avatar_data: { head: "default", hair: "default" },
				emotional_expression: {
					method: "",
					drawing_data: "",
					selected_feelings: [],
					body_map_annotations: [],
				},
				session_notes: "",
				tags: [],
				stage: "Stage 1",
			};
			await createSession(payload);
			setStep(1);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Failed to create session");
		} finally {
			setLoading(false);
		}
	};

	const handleAvatarDataNext = async () => {
		if (!user) return;
		setLoading(true);
		setError(null);
		try {
			const payload: CreateSessionPayload = {
				social_worker_id: user.id,
				title: sessionTitle,
				child_data: { ...childData, age: Number(childData.age) },
				avatar_data: avatarData,
				emotional_expression: {
					method: "",
					drawing_data: "",
					selected_feelings: [],
					body_map_annotations: [],
				},
				session_notes: "",
				tags: [],
				stage: "Stage 2",
			};
			await createSession(payload);
			setStep(2);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Failed to create session");
		} finally {
			setLoading(false);
		}
	};

	const handleEmotionalExpressionsNext = async () => {
		if (!user) return;
		setLoading(true);
		setError(null);
		try {
			const payload: CreateSessionPayload = {
				social_worker_id: user.id,
				title: sessionTitle,
				child_data: { ...childData, age: Number(childData.age) },
				avatar_data: avatarData,
				emotional_expression: {
					method: "drawing",
					drawing_data: "base64encodedstringhere",
					selected_feelings: [emotion],
					body_map_annotations: [],
				},
				session_notes: "",
				tags: [],
				stage: "Stage 5",
			};
			await createSession(payload);
			setStep(5);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Failed to create session");
		} finally {
			setLoading(false);
		}
	};

	const handleVideoMinigamesNext = async () => {
		if (!user) return;
		setLoading(true);
		setError(null);
		try {
			const payload: CreateSessionPayload = {
				social_worker_id: user.id,
				title: sessionTitle,
				child_data: { ...childData, age: Number(childData.age) },
				avatar_data: avatarData,
				emotional_expression: {
					method: "",
					drawing_data: "",
					selected_feelings: [],
					body_map_annotations: [],
				},
				session_notes: "",
				tags: [],
				stage: "Stage 3",
			};
			await createSession(payload);
			setStep(3);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Failed to create session");
		} finally {
			setLoading(false);
		}
	};

	const handleStage4Next = async () => {
		if (!user) return;
		setLoading(true);
		setError(null);
		try {
			const payload: CreateSessionPayload = {
				social_worker_id: user.id,
				title: sessionTitle,
				child_data: { ...childData, age: Number(childData.age) },
				avatar_data: avatarData,
				emotional_expression: {
					method: "",
					drawing_data: "",
					selected_feelings: [],
					body_map_annotations: [],
				},
				session_notes: "",
				tags: [],
				stage: "Stage 4",
			};
			await createSession(payload);
			setStep(4);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Failed to create session");
		} finally {
			setLoading(false);
		}
	};

	const handleSessionNotesNext = async () => {
		if (!user) return;
		setLoading(true);
		setError(null);
		// Parse tags from tagsInput before submit
		const parsedTags = tagsInput
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);
		try {
			const payload: CreateSessionPayload = {
				social_worker_id: user.id,
				title: sessionTitle,
				child_data: { ...childData, age: Number(childData.age) },
				avatar_data: avatarData,
				emotional_expression: {
					method: "drawing",
					drawing_data: "base64encodedstringhere",
					selected_feelings: [emotion],
					body_map_annotations: [],
				},
				session_notes: sessionNotes,
				tags: parsedTags,
				stage: "Stage 6",
			};
			await createSession(payload);
			// show success state here
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Failed to create session");
		} finally {
			setLoading(false);
		}
	};

	// Stage-specific avatar messages
	const stageMessages = [
		"Let's fill in your child's information!",
		"Time to customize your avatar!",
		"Ready for some video and minigames?",
		"Let's continue to the next step!",
		"How are you feeling today?",
		"Add your session notes and tags!",
	];

	return (
		<div className="flex min-h-screen ">
			{/* Left: Vertical Stepper Overlay */}
			<aside className="hidden md:flex flex-col items-center min-h-screen w-72 py-12 bg-white/40 backdrop-blur-sm fixed left-0 top-0 z-20">
				<VerticalStepper steps={steps} currentStep={step} />
			</aside>
			{/* Right: Form Content */}
			<main className="flex-1 ml-0 md:ml-72 flex flex-col p-8">
				{/* Avatar and speech bubble */}
				<motion.div
					layout
					transition={{ type: "spring", stiffness: 100, damping: 40 }}
					className={
						!showChildForm && step === 0
							? "flex-shrink-0 flex justify-center md:justify-start md:w-1/3"
							: "fixed bottom-20 right-20 z-30"
					}
					style={!showChildForm && step === 0 ? {} : { pointerEvents: "none" }}
				>
					<AvatarCharacter
						message={
							!showChildForm && step === 0
								? avatarMessage
								: stageMessages[step] || ""
						}
						showNext={!showChildForm}
						onNext={handleGotIt}
						bubblePosition="left"
						size={!showChildForm && step === 0 ? "2xl" : "md"}
					/>
				</motion.div>
				<div className="flex-1 w-full">
					{error && <div className="text-red-500 mb-2">{error}</div>}
					{step === 0 && showChildForm && (
						<Stage1ChildData
							value={childData}
							onChange={setChildData}
							onNext={handleChildDataNext}
							loading={loading}
							error={error || undefined}
						/>
					)}
					{step === 1 && (
						<Stage2AvatarData
							value={avatarData}
							onChange={setAvatarData}
							onNext={handleAvatarDataNext}
							onBack={() => setStep(0)}
							loading={loading}
							error={error || undefined}
						/>
					)}
					{step === 2 && (
						<Stage3VideoMinigames
							onNext={handleVideoMinigamesNext}
							onBack={() => setStep(1)}
							loading={loading}
							error={error || undefined}
						/>
					)}
					{step === 3 && (
						<Stage4Other
							onNext={handleStage4Next}
							onBack={() => setStep(2)}
							loading={loading}
							error={error || undefined}
						/>
					)}
					{step === 4 && (
						<Stage5EmotionalExpressions
							value={emotion}
							onChange={setEmotion}
							onNext={handleEmotionalExpressionsNext}
							onBack={() => setStep(3)}
							loading={loading}
							error={error || undefined}
						/>
					)}
					{step === 5 && (
						<Stage6SessionNotesTags
							notes={sessionNotes}
							tagsInput={tagsInput}
							onNotesChange={setSessionNotes}
							onTagsInputChange={setTagsInput}
							onTagsBlur={() => {}}
							onNext={handleSessionNotesNext}
							onBack={() => setStep(4)}
							loading={loading}
							error={error || undefined}
						/>
					)}
				</div>
			</main>
		</div>
	);
}
