import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSessionsBySocialWorkerId, updateSession } from "@/api/sessions";
import AvatarCharacter from "@/features/avatar-character";
import { useAuth } from "@/hooks/useAuth";
import type { Session } from "@/types/sessions";
import VerticalStepper from "./components/VerticalStepper";
import Stage1ChildData from "./stages/Stage1ChildData";
import Stage2AvatarData from "./stages/Stage2AvatarData";
import Stage3VideoMinigames from "./stages/Stage3VideoMinigames";
import Stage4Other from "./stages/Stage4Other";
import Stage5EmotionalExpressions from "./stages/Stage5EmotionalExpressions";
import Stage6SessionNotesTags from "./stages/Stage6SessionNotesTags";
import Stage7Completion from "./stages/Stage7Completion";

const steps = [
	"Child Data",
	"Avatar Data",
	"Video & Minigames",
	"Stage 4",
	"Emotional Expressions",
	"Session Notes & Tags",
	"Completion",
];

export default function Room() {
	const [step, setStep] = useState(0);
	const { user } = useAuth();
	const { session_id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (session_id === "undefined") {
			navigate("/room", { replace: true });
		}
	}, [session_id, navigate]);

	// Restore step from backend session stage
	useEffect(() => {
		async function restoreStep() {
			if (!session_id || !user?.id) return;
			try {
				const sessionsResp = await fetchSessionsBySocialWorkerId(user.id);
				const sessions = sessionsResp?.data || [];
				const session = (sessions as Session[]).find(
					(s: Session) => s.session_id === session_id,
				);
				const stage = session?.stage;
				// Use 0-based mapping for stageToStep
				const stageToStep: Record<string, number> = {
					"Stage 1": 0,
					"Stage 2": 1,
					"Stage 3": 2,
					"Stage 4": 3,
					"Stage 5": 4,
					"Stage 6": 5,
					Completion: 6,
				};
				if (stage && Object.hasOwn(stageToStep, stage)) {
					setStep(stageToStep[stage]);
				}
				if (session?.child_data) {
					setChildData({
						...session.child_data,
						age: String(session.child_data.age ?? ""),
					});
				}
			} catch (err) {
				console.error("Failed to restore session step:", err);
			}
		}
		restoreStep();
	}, [session_id, user?.id]);

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
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sessionNotes, setSessionNotes] = useState("");
	const [tagsInput, setTagsInput] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	// Remove isCompleted from state
	// const [isCompleted, setIsCompleted] = useState(false);

	// Handler for 'Got it!' in stage 1
	const handleGotIt = () => {
		setAvatarMessage("Great! What's your name and age?");
		setShowChildForm(true);
	};

	// Update all handleXNext functions to set the backend to the NEXT stage
	const handleChildDataNext = async () => {
		if (!user || loading || !session_id) return;
		setLoading(true);
		setError(null);
		try {
			// Update to the NEXT stage
			await updateSession(session_id, {
				child_data: { ...childData, age: Number(childData.age) },
				stage: "Stage 2",
			});
			setStep(1);
		} catch (err: unknown) {
			console.error("Update session error:", err);
			if (err instanceof Error) setError(err.message);
			else setError("Failed to update session");
		} finally {
			setLoading(false);
		}
	};

	const handleAvatarDataNext = async () => {
		if (!user || !session_id) return;
		setLoading(true);
		setError(null);
		try {
			await updateSession(session_id, {
				avatar_data: avatarData,
				stage: "Stage 3",
			});
			setStep(2);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Failed to update session");
		} finally {
			setLoading(false);
		}
	};

	const handleVideoMinigamesNext = async () => {
		if (!user || !session_id) return;
		setLoading(true);
		setError(null);
		try {
			await updateSession(session_id, {
				stage: "Stage 4",
			});
			setStep(3);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Failed to update session");
		} finally {
			setLoading(false);
		}
	};

	const handleStage4Next = async () => {
		if (!user || !session_id) return;
		setLoading(true);
		setError(null);
		try {
			await updateSession(session_id, {
				stage: "Stage 5",
			});
			setStep(4);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Failed to update session");
		} finally {
			setLoading(false);
		}
	};

	const handleEmotionalExpressionsNext = async () => {
		if (!user || !session_id) return;
		setLoading(true);
		setError(null);
		try {
			await updateSession(session_id, {
				emotional_expression: {
					method: "drawing",
					drawing_data: "base64encodedstringhere",
					selected_feelings: [emotion],
					body_map_annotations: [],
				},
				stage: "Stage 6",
			});
			setStep(5);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Failed to update session");
		} finally {
			setLoading(false);
		}
	};

	const handleTagsInputChange = (val: string) => {
		setTagsInput(val);
	};

	const handleTagsBlur = () => {
		// Parse tags from input
		const parsedTags = tagsInput
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);
		// Only keep unique tags
		const uniqueTags = Array.from(new Set(parsedTags));
		setTags(uniqueTags);
		setTagsInput(uniqueTags.join(", "));
	};

	const handleSessionNotesNext = async () => {
		if (!user || !session_id) return;
		setLoading(true);
		setError(null);
		try {
			await updateSession(session_id, {
				session_notes: sessionNotes,
				tags: tags, // use deduplicated tags
				stage: "Completion",
			});
			setStep(6);
			// setIsCompleted(true); // Remove this line
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Failed to update session");
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
		"🎉 Congratulations! 🎉",
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
				{step !== 6 && (
					<motion.div
						layout
						transition={{ type: "spring", stiffness: 100, damping: 40 }}
						className={
							!showChildForm && step === 0
								? "flex-shrink-0 flex justify-center md:justify-start md:w-1/3"
								: "fixed bottom-20 right-20 z-30"
						}
						style={
							!showChildForm && step === 0 ? {} : { pointerEvents: "none" }
						}
					>
						<AvatarCharacter
							message={
								!showChildForm && step === 0
									? avatarMessage
									: stageMessages[step] || ""
							}
							showNext={!showChildForm && step === 0}
							onNext={handleGotIt}
							bubblePosition="left"
							size={!showChildForm && step === 0 ? "2xl" : "md"}
						/>
					</motion.div>
				)}

				{/* Step Content */}
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
						onTagsInputChange={handleTagsInputChange}
						onTagsBlur={handleTagsBlur}
						onNext={handleSessionNotesNext}
						onBack={() => setStep(4)}
						loading={loading}
						error={error || undefined}
					/>
				)}
				{step === 6 && (
					<Stage7Completion
						childName={childData.first_name}
						onBack={() => setStep(5)}
					/>
				)}
			</main>
		</div>
	);
}
