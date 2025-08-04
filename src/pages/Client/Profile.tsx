import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	CameraIcon,
	Trash2Icon,
	RotateCcwIcon,
	UserIcon,
	MailIcon,
	KeyRoundIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
	updateUserInfo,
	updateUserProfilePicture,
	removeUserProfilePicture,
} from "@/api/users";
import SpinnerLoading from "@/components/ui/spinner-loading";
import { toast } from "sonner";
import type { User } from "@/types";

export default function ProfilePage() {
	const { user, token, invalidateUser, updateUserState } = useAuth();
	const defaultUser: User = {
		id: "",
		first_name: "",
		last_name: "",
		username: "",
		place_of_assignment: "",
		phone_number: "",
		email: "",
		password: "",
		role: "",
		condition: "",
		createdAt: "",
		updatedAt: "",
		profile_picture: "",
	};

	const [profile, setProfile] = useState<User | null>(
		user ? { ...defaultUser, ...user } : null,
	);
	const [loading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	useEffect(() => {
		setProfile(user ? { ...defaultUser, ...user } : null);
	}, [user]);

	// Check if there are any changes
	const hasChanges = () => {
		if (!user || !profile) return false;

		// Check if profile picture is being changed
		if (previewImage) return true;

		// Check if any profile fields have changed (only fields that exist in both user and profile)
		return (
			profile.first_name !== user.first_name ||
			profile.last_name !== user.last_name ||
			profile.email !== user.email ||
			profile.place_of_assignment !== user.place_of_assignment ||
			profile.username !== (user as User).username ||
			profile.phone_number !== (user as User).phone_number
		);
	};

	// Cleanup preview image URL when component unmounts
	useEffect(() => {
		return () => {
			if (previewImage) {
				URL.revokeObjectURL(previewImage);
			}
		};
	}, [previewImage]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setProfile((prev) => ({
			...(prev as User),
			[name]: value,
		}));
	};

	const handleSelectChange = (name: keyof User, value: string) => {
		setProfile((prev) => ({
			...(prev as User),
			[name]: value,
		}));
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!profile) return;
		if (e.target.files?.[0]) {
			const file = e.target.files[0];

			// Create preview URL
			const previewUrl = URL.createObjectURL(file);
			setPreviewImage(previewUrl);
			setSelectedFile(file);

			// Reset the input
			e.target.value = "";
		}
	};

	const handleCancelProfilePicture = () => {
		// Clear preview and selected file
		if (previewImage) {
			URL.revokeObjectURL(previewImage);
		}
		setPreviewImage(null);
		setSelectedFile(null);
		toast.info("Profile picture change cancelled");
	};

	const handleRemoveAvatar = async () => {
		if (!profile) return;
		if (!token) {
			toast.error("No token available to remove profile picture.");
			return;
		}
		try {
			setSaving(true);
			const loadingToast = toast.loading("Removing profile picture...");
			await removeUserProfilePicture(profile.id, token);

			// Update local profile state
			setProfile((prev) => ({
				...(prev as User),
				profile_picture: "",
			}));

			// Immediately update user context for instant UI feedback
			updateUserState({ profile_picture: undefined });

			toast.dismiss(loadingToast);
			toast.success("Profile picture removed successfully!");
			// Invalidate user query to update NavUser component
			invalidateUser();
		} catch (err) {
			if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error("Failed to remove profile picture");
			}
		} finally {
			setSaving(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!profile) return;
		setSaving(true);
		try {
			const loadingToast = toast.loading("Updating profile...");

			// First, save profile picture if there's a selected file
			if (selectedFile && token) {
				const newUrl = await updateUserProfilePicture(
					profile.id,
					selectedFile,
					token,
				);
				updateUserState({ profile_picture: newUrl });
				setProfile((prev) => ({
					...(prev as User),
					profile_picture: newUrl,
				}));
				setPreviewImage(null);
				setSelectedFile(null);
			}

			// Then save profile info
			if (!token) throw new Error("No token");
			const updateData: Partial<User> = {
				first_name: profile?.first_name,
				last_name: profile?.last_name,
				username: profile?.username,
				email: profile?.email,
				phone_number: profile?.phone_number,
				place_of_assignment: profile?.place_of_assignment,
				role: profile?.role,
			};
			await updateUserInfo(profile.id, updateData, token);

			// Immediately update user context for instant UI feedback
			updateUserState({
				first_name: profile?.first_name,
				last_name: profile?.last_name,
				email: profile?.email,
				place_of_assignment: profile?.place_of_assignment,
				role: profile?.role,
			});

			toast.dismiss(loadingToast);
			toast.success("Profile updated successfully!");
			// Invalidate user query to update NavUser component
			invalidateUser();
		} catch (err) {
			if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error("Failed to update profile");
			}
		} finally {
			setSaving(false);
		}
	};

	const handleReset = () => {
		if (!user) return;
		setProfile({ ...defaultUser, ...user });
		if (previewImage) {
			URL.revokeObjectURL(previewImage);
		}
		setPreviewImage(null);
		setSelectedFile(null);
		toast.info("Changes reset to original values");
	};

	if (loading) {
		return <SpinnerLoading />;
	}
	if (!profile) {
		return null;
	}

	return (
		<div className="flex justify-center items-center">
			<Card className="w-full max-w-3xl">
				<CardContent className="space-y-10 p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="flex flex-col items-center gap-6 mb-8">
							<div className="relative group">
								<Avatar className="h-32 w-32 border-4 border-white ring-4 ring-purple-300 shadow-lg transition-all duration-300 group-hover:ring-purple-400">
									<AvatarImage
										src={previewImage || (profile.profile_picture ?? undefined)}
										alt={`${profile.first_name} ${profile.last_name} avatar`}
									/>
									<AvatarFallback className="bg-purple-100 text-purple-700 text-2xl font-bold">
										{profile.first_name?.[0]}
										{profile.last_name?.[0]}
									</AvatarFallback>
								</Avatar>
								<label
									htmlFor="avatar-upload"
									className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
								>
									<CameraIcon className="h-8 w-8 text-white" />
									<span className="sr-only">Upload avatar</span>
								</label>
								<Input
									id="avatar-upload"
									type="file"
									accept="image/*"
									onChange={handleAvatarChange}
									className="hidden"
								/>
								{profile.profile_picture && !previewImage && (
									<Button
										variant="ghost"
										size="icon"
										onClick={handleRemoveAvatar}
										className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md transition-transform duration-200 hover:scale-110"
										disabled={saving}
									>
										<Trash2Icon className="h-5 w-5" />
										<span className="sr-only">Remove avatar</span>
									</Button>
								)}
							</div>

							{/* Cancel button for profile picture changes */}
							{previewImage && (
								<div className="flex gap-2">
									<Button
										size="sm"
										variant="outline"
										onClick={handleCancelProfilePicture}
										disabled={saving}
										className="text-sm bg-white border-gray-300 hover:bg-gray-50"
									>
										Cancel Picture Change
									</Button>
								</div>
							)}
						</div>

						<div className="space-y-10">
							{/* Personal Information Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
									<UserIcon className="h-6 w-6 text-purple-500" /> Personal
									Information
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
									<div className="space-y-2">
										<Label htmlFor="first_name">First Name</Label>
										<Input
											id="first_name"
											name="first_name"
											value={profile.first_name}
											onChange={handleInputChange}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="last_name">Last Name</Label>
										<Input
											id="last_name"
											name="last_name"
											value={profile.last_name}
											onChange={handleInputChange}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="username">Username</Label>
										<Input
											id="username"
											name="username"
											value={profile.username}
											onChange={handleInputChange}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="place_of_assignment">
											Place of Assignment
										</Label>
										<Select
											name="place_of_assignment"
											value={profile.place_of_assignment}
											onValueChange={(value) =>
												handleSelectChange("place_of_assignment", value)
											}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select a Place" />
											</SelectTrigger>
											<SelectContent className="w-full min-w-[200px]">
												<SelectItem value="Bontoc">Bontoc</SelectItem>
												<SelectItem value="Barlig">Barlig</SelectItem>
												<SelectItem value="Bauko">Bauko</SelectItem>
												<SelectItem value="Besao">Besao</SelectItem>
												<SelectItem value="Natonin">Natonin</SelectItem>
												<SelectItem value="Paracelis">Paracelis</SelectItem>
												<SelectItem value="Sabangan">Sabangan</SelectItem>
												<SelectItem value="Sadanga">Sadanga</SelectItem>
												<SelectItem value="Sagada">Sagada</SelectItem>
												<SelectItem value="Tadian">Tadian</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							{/* Contact Information Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
									<MailIcon className="h-6 w-6 text-purple-500" /> Contact
									Information
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											name="email"
											type="email"
											value={profile.email}
											onChange={handleInputChange}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="phone_number">Phone Number</Label>
										<Input
											id="phone_number"
											name="phone_number"
											type="tel"
											value={profile.phone_number || ""}
											onChange={handleInputChange}
										/>
									</div>
								</div>
							</div>

							{/* Account Details Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
									<KeyRoundIcon className="h-6 w-6 text-purple-500" /> Account
									Details
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
									<div className="space-y-2">
										<Label htmlFor="role">Role</Label>
										<Input
											id="role"
											name="role"
											value={profile.role}
											disabled
											className="bg-gray-100 cursor-not-allowed"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="id">User ID</Label>
										<Input
											id="id"
											name="id"
											value={profile.id}
											disabled
											className="bg-gray-100 cursor-not-allowed"
										/>
									</div>
								</div>
							</div>
						</div>
						<CardFooter className="flex justify-end p-0 pt-8 gap-4 border-t border-gray-100 mt-8">
							{hasChanges() && (
								<>
									<Button
										type="button"
										variant="outline"
										onClick={handleReset}
										disabled={saving}
										className="flex items-center gap-2 px-6 py-3 text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors duration-200 bg-transparent"
									>
										<RotateCcwIcon className="h-4 w-4" />
										Reset
									</Button>
									<Button
										type="submit"
										disabled={saving}
										className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition-colors duration-200"
									>
										{saving ? (
											<>
												<svg
													className="animate-spin h-4 w-4 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													aria-hidden="true"
													role="img"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Saving...
											</>
										) : (
											"Save Changes"
										)}
									</Button>
								</>
							)}
						</CardFooter>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
