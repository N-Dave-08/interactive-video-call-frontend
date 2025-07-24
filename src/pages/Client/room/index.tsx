import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
	Outlet,
	useMatch,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";
import { fetchSessionsBySocialWorkerId, updateSession } from "@/api/sessions";
import SpinnerLoading from "@/components/ui/spinner-loading";
import AvatarCharacter from "@/features/avatar-character";
import { useAuth } from "@/hooks/useAuth";
import Stepper from "@/pages/Client/room/Stepper";
import Stage1ChildData from "@/pages/Client/room/stages/Stage1ChildData";
import Stage2AvatarData from "@/pages/Client/room/stages/Stage2AvatarData";
import Stage3VideoMinigames from "@/pages/Client/room/stages/Stage3VideoMinigames";
import Stage4Other from "@/pages/Client/room/stages/Stage4Other";
import Stage5EmotionalExpressions from "@/pages/Client/room/stages/Stage5EmotionalExpressions";
import Stage6SessionNotesTags from "@/pages/Client/room/stages/Stage6SessionNotesTags";
import Stage7Completion from "@/pages/Client/room/stages/Stage7Completion";
import { useQuestionStore } from "@/store/questionStore";
import type { ChildData, Session } from "@/types/sessions";

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
	const [searchParams, setSearchParams] = useSearchParams();
	const isMiniGameRoute = useMatch("/room/:session_id/mini-games/:slug");

	const [initialLoading, setInitialLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);

	const setQuestion = useQuestionStore((s) => s.setQuestion);

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
				if (!session) {
					setLoadError("Session not found.");
					setInitialLoading(false);
					return;
				}
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
				let restoredStep = 0;
				if (stage && Object.hasOwn(stageToStep, stage)) {
					restoredStep = stageToStep[stage];
				}
				// Check if Stage 1 data is incomplete
				const child: Partial<ChildData> = session?.child_data || {};
				const isStage1Complete =
					!!child.first_name &&
					!!child.last_name &&
					!!child.age &&
					!!child.birthday;
				if (restoredStep > 0 && !isStage1Complete) {
					setStep(0); // Force back to Stage 1
					setShowChildForm(true);
				} else {
					setStep(restoredStep);
					if (restoredStep === 0 && isStage1Complete) setShowChildForm(true);
				}
				if (session?.child_data) {
					setChildData({
						first_name: session.child_data.first_name ?? "",
						last_name: session.child_data.last_name ?? "",
						age: String(session.child_data.age ?? ""),
						birthday: session.child_data.birthday ?? "",
						gender: session.child_data.gender ?? "", // Restore gender
					});
				}
				if (session?.emotional_expression?.selected_feelings?.[0]) {
					setEmotion(session.emotional_expression.selected_feelings[0]);
				}
				setInitialLoading(false);
			} catch (err) {
				console.error("Failed to restore session step:", err);
				setLoadError("Failed to load session. Please try again.");
				setInitialLoading(false);
			}
		}
		restoreStep();
	}, [session_id, user?.id]);

	// Stage 1 interaction states
	const [showChildForm, setShowChildForm] = useState(() => {
		const saved = localStorage.getItem("showChildForm");
		return saved === "true";
	});

	// Stepper hover state for Framer Motion
	const [stepperHovered, setStepperHovered] = useState(false);

	// Example state for form fields
	const [childData, setChildData] = useState({
		first_name: "",
		last_name: "",
		age: "",
		birthday: "",
		gender: "", // Add gender to state
	});
	const [avatarData, setAvatarData] = useState({
		head: "/avatar-assets/heads/default-head-clear.png",
		hair: "/avatar-assets/hairs/HairB1.png",
		expression: "/avatar-assets/expressions/F1.png",
		clothes: "/avatar-assets/clothes/boy-uniform.png",
		background: "/avatar-assets/bg/bg3.jpg",
	});
	const [emotion, setEmotion] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sessionNotes, setSessionNotes] = useState("");
	const [tagsInput, setTagsInput] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [bodyMapAnnotations, setBodyMapAnnotations] = useState<string[]>([]);
	const [drawingData, setDrawingData] = useState<string>("");

	// Handler for 'Got it!' in stage 1
	const handleGotIt = () => {
		localStorage.removeItem("stage1-current-step"); // Clear stepper state for new session
		setShowChildForm(true);
		localStorage.setItem("showChildForm", "true");
	};

	// Update all handleXNext functions to set the backend to the NEXT stage
	const handleChildDataNext = async () => {
		if (!user || loading || !session_id) return;
		setLoading(true);
		setError(null);
		try {
			// Update to the NEXT stage
			await updateSession(session_id, {
				child_data: {
					...childData,
					age: Number(childData.age),
					gender: childData.gender,
				},
				stage: "Stage 2",
			});
			setStep(1);
			setShowChildForm(false);
			localStorage.removeItem("showChildForm");
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
				avatar_data: {
					head: avatarData.head,
					hair: avatarData.hair,
					expression: avatarData.expression,
					clothes: avatarData.clothes,
					background: avatarData.background,
				},
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
					drawing_data: drawingData, // Use the actual drawing data
					selected_feelings: [emotion],
					body_map_annotations: bodyMapAnnotations,
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
		// Parse tags from input
		const parsedTags = val
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);
		// Only keep unique tags
		const uniqueTags = Array.from(new Set(parsedTags));
		setTags(uniqueTags);
		setTagsInput(val); // Keep the raw input for display
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
				status: "completed",
			});
			setStep(6);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Failed to update session");
		} finally {
			setLoading(false);
		}
	};

	// Handler to update emotion and persist to backend
	// const handleEmotionChange = async (newEmotion: string) => {
	// 	setEmotion(newEmotion);
	// 	if (session_id && user) {
	// 		try {
	// 			await updateSession(session_id, {
	// 				emotional_expression: {
	// 					method: "feeling",
	// 					drawing_data: "",
	// 					selected_feelings: [newEmotion],
	// 					body_map_annotations: [],
	// 				},
	// 			});
	// 		} catch (err) {
	// 			// Optionally handle error
	// 			console.error("Failed to update emotion:", err);
	// 		}
	// 	}
	// };

	interface SelectedParts {
		[key: string]: { pain: boolean; touch: boolean };
	}

	const handleBodyMapChange = async (
		front: SelectedParts,
		back: SelectedParts,
	) => {
		// Build string annotations like 'upperBack:pain'
		const annotations: string[] = [];
		for (const [part, sel] of Object.entries(front)) {
			if (sel.pain) annotations.push(`${part}:pain`);
			if (sel.touch) annotations.push(`${part}:touch`);
		}
		for (const [part, sel] of Object.entries(back)) {
			if (sel.pain) annotations.push(`${part}:pain`);
			if (sel.touch) annotations.push(`${part}:touch`);
		}
		setBodyMapAnnotations(annotations);
		if (session_id && user) {
			try {
				await updateSession(session_id, {
					emotional_expression: {
						method: "bodymap",
						drawing_data: drawingData,
						selected_feelings: [emotion],
						body_map_annotations: annotations,
					},
				});
			} catch (err) {
				console.error("Failed to update body map:", err);
			}
		}
	};

	// const handleDrawingChange = async (drawingBase64: string) => {
	// 	setDrawingData(drawingBase64);
	// 	if (session_id && user) {
	// 		try {
	// 			await updateSession(session_id, {
	// 				emotional_expression: {
	// 					method: "drawing",
	// 					drawing_data: drawingBase64,
	// 					selected_feelings: [emotion],
	// 					body_map_annotations: bodyMapAnnotations, // now string[]
	// 				},
	// 			});
	// 		} catch (err) {
	// 			console.error("Failed to update drawing:", err);
	// 		}
	// 	}
	// };

	useEffect(() => {
		if (!showChildForm && step === 0) {
			setQuestion("Hello! Let's have some fun together.");
		}
	}, [showChildForm, step, setQuestion]);

	// Clear 'panel' query param when not in Stage 3
	useEffect(() => {
		if (step !== 2) {
			if (searchParams.has("panel")) {
				searchParams.delete("panel");
				setSearchParams(searchParams);
			}
		}
	}, [step, searchParams, setSearchParams]);

	return (
		<div className="h-screen">
			<Outlet />
			{!isMiniGameRoute && (
				<>
					{/* Spinner Loader for initial loading */}
					{initialLoading && <SpinnerLoading />}
					{/* Error state */}
					{!initialLoading && loadError && (
						<div className="flex flex-col items-center justify-center h-full w-full p-8">
							<p className="text-red-500 text-lg font-semibold">{loadError}</p>
						</div>
					)}
					{/* Main content (hidden while loading) */}
					{!initialLoading && !loadError && (
						<>
							{/* Left: Vertical Stepper Overlay */}
							<div className="fixed top-0 left-0 right-0 z-50">
								<motion.div
									initial={{ y: "-100%" }}
									animate={{ y: stepperHovered ? "0%" : "-100%" }}
									transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
									style={{ width: "100%" }}
								>
									<div className="max-w-4xl mx-auto px-8 py-4">
										<Stepper steps={steps} currentStep={step} />
									</div>
								</motion.div>
								{/* Hover trigger area (accessible) */}
								<button
									className="h-4 bg-transparent w-full p-0 m-0 border-none outline-none"
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										right: 0,
										zIndex: 51,
										cursor: "pointer",
									}}
									onMouseEnter={() => setStepperHovered(true)}
									onMouseLeave={() => setStepperHovered(false)}
									aria-label="Show stepper navigation"
									tabIndex={0}
									type="button"
								/>
							</div>
							{/* Right: Form Content */}
							<main className="flex-1 ml-0 flex flex-col h-10/12">
								{/* Avatar and speech bubble */}
								{step !== 6 && (
									<motion.div
										layout
										transition={{ type: "spring", stiffness: 100, damping: 40 }}
										className={
											step === 0 && !showChildForm
												? "fixed inset-0 z-30 flex items-center justify-center"
												: step === 0
													? "fixed top-96 right-96 z-30"
													: "fixed bottom-20 right-20 z-30"
										}
										style={step === 0 ? {} : { pointerEvents: "none" }}
									>
										<AvatarCharacter
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
										onBack={() => {
											setStep(0);
											setShowChildForm(true);
										}}
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
										onBodyMapChange={handleBodyMapChange}
										onDrawingComplete={setDrawingData} // Pass this to capture the drawing
									/>
								)}
								{step === 5 && (
									<Stage6SessionNotesTags
										notes={sessionNotes}
										tagsInput={tagsInput}
										onNotesChange={setSessionNotes}
										onTagsInputChange={handleTagsInputChange}
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
						</>
					)}
				</>
			)}
		</div>
	);
}
