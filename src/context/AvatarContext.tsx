import type React from "react";
import { createContext, useContext, useState } from "react";

type AvatarState = {
	head: string;
	hair: string;
	emotion: string;
};

const defaultAvatar: AvatarState = {
	head: "default",
	hair: "default",
	emotion: "neutral",
};

const AvatarContext = createContext<{
	avatar: AvatarState;
	setAvatar: React.Dispatch<React.SetStateAction<AvatarState>>;
}>({
	avatar: defaultAvatar,
	setAvatar: () => {},
});

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
	const [avatar, setAvatar] = useState<AvatarState>(defaultAvatar);
	return (
		<AvatarContext.Provider value={{ avatar, setAvatar }}>
			{children}
		</AvatarContext.Provider>
	);
};

export const useAvatar = () => useContext(AvatarContext);
