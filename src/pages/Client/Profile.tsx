
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CameraIcon } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { updateUserInfo, fetchUsers, updateUserProfilePicture } from "@/api/users"
import SpinnerLoading from "@/components/ui/spinner-loading"
import type { User } from "@/types";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<User | null>(user);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProfile(user);
  }, [user]);

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
      try {
        setSaving(true);
        if (!token) throw new Error("No token");
        const newUrl = await updateUserProfilePicture(profile.id, file, token);
        setProfile((prev) => ({
          ...(prev as User),
          profile_picture: newUrl,
        }));
        setSuccess(true);
      } catch {
        setError("Failed to update profile picture");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
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
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SpinnerLoading />;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  }
  if (!profile) {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
          <CardDescription>Manage your personal information and settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.profile_picture ?? undefined} alt="User Avatar" />
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
              </div>
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
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
              {success && <span className="text-green-600 text-sm">Profile updated successfully!</span>}
              {error && <span className="text-red-600 text-sm">{error}</span>}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
