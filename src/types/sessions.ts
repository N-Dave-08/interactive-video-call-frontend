export interface AvatarData {
	hair: string;
	head: string;
	expression: string;
	clothes: string;
	background: string;
}

export interface BodyMapAnnotation {
	note: string;
	part: string;
}

export interface DrawingData {
	images: string[];
}

export interface EmotionalExpression {
	method: string;
	drawing_data: string;
	selected_feelings: string[];
	body_map_annotations: string[];
}

export interface UserInfo {
	first_name: string;
	last_name: string;
}

export interface Session {
	session_id: string;
	social_worker_id: string;
	title: string;
	start_time: string;
	end_time: string | null;
	child_data: ChildData;
	avatar_data: AvatarData;
	emotional_expression: EmotionalExpression;
	session_notes: string;
	tags: string[];
	status: string;
	stage: string;
	createdAt: string;
	updatedAt: string;
	user: UserInfo;
}

export interface SessionsListResponse {
	success: boolean;
	message: string;
	data: Session[];
	counts: {
		scheduled: number;
		in_progress: number;
		completed: number;
		archived: number;
		rescheduled: number;
	};
}

export interface CreateSessionPayload {
	social_worker_id: string;
	title: string;
	child_data: ChildData;
	avatar_data: AvatarData;
	emotional_expression: EmotionalExpression;
	session_notes: string;
	tags: string[];
	stage: string;
}

export interface SessionApiResponse {
	success: boolean;
	message: string;
	data: Session;
}

export interface ChildData {
	age: number;
	birthday: string;
	last_name: string;
	first_name: string;
	gender: string;
}
