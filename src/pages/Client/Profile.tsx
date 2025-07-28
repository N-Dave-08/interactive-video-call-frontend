
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CameraIcon, Trash2Icon } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { updateUserInfo, updateUserProfilePicture, removeUserProfilePicture } from "@/api/users"
import SpinnerLoading from "@/components/ui/spinner-loading"
import { toast } from "sonner"
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

  const [profile, setProfile] = useState<User | null>(user ? { ...defaultUser, ...user } : null);
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
      profile.place_of_assignment !== user.place_of_assignment
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
      e.target.value = '';
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
        const newUrl = await updateUserProfilePicture(profile.id, selectedFile, token);
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

  if (loading) {
    return <SpinnerLoading />;
  }
  if (!profile) {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            User Profile
            {hasChanges() && (
              <span className="text-sm text-orange-600 font-normal">
                (Unsaved changes)
              </span>
            )}
          </CardTitle>
          <CardDescription>Manage your personal information and settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={previewImage || (profile.profile_picture ?? undefined)} 
                    alt="User Avatar" 
                  />
                  <AvatarFallback>
                    {profile.first_name?.[0]}
                    {profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                >
                  <CameraIcon className="h-6 w-6 text-white" />
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
                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                    disabled={saving}
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span className="sr-only">Remove avatar</span>
                  </Button>
                )}
              </div>
              
              {/* Cancel button for profile picture changes */}
              {previewImage && (
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelProfilePicture}
                    disabled={saving}
                  >
                    Cancel Picture
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input id="first_name" name="first_name" value={profile.first_name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input id="last_name" name="last_name" value={profile.last_name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" value={profile.username} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={profile.email} onChange={handleInputChange} />
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
                <div className="space-y-2">
                  <Label htmlFor="place_of_assignment">Place of Assignment</Label>
                  <Select
                    name="place_of_assignment"
                    value={profile.place_of_assignment}
                    onValueChange={(value) => handleSelectChange("place_of_assignment", value)}
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
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" name="role" value={profile.role} disabled />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="id">User ID</Label>
                  <Input id="id" name="id" value={profile.id} disabled />
                </div>
              </div>
            </div>
            <CardFooter className="flex flex-col items-end p-0 pt-6 gap-2">
              {hasChanges() && (
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
