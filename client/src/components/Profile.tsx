import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Edit, Check, X } from "lucide-react";

// Local fallback image as a data URI - a simple gray avatar with user silhouette
const FALLBACK_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarError, setAvatarError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.profile?.bio || "");
      setJobTitle(user.profile?.jobTitle || "");
      setAvatarUrl(user.profile?.avatarUrl || "");
      setAvatarError(false); // Reset error state when user changes
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const success = await updateProfile({
        name,
        bio,
        jobTitle,
        avatarUrl: avatarError ? "" : avatarUrl, // Don't save bad URLs
      });

      if (success) {
        setEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Reset to current user values
    if (user) {
      setName(user.name || "");
      setBio(user.profile?.bio || "");
      setJobTitle(user.profile?.jobTitle || "");
      setAvatarUrl(user.profile?.avatarUrl || "");
      setAvatarError(false);
    }
    setEditing(false);
  };

  const handleImageError = () => {
    console.log("Image failed to load:", avatarUrl);
    setAvatarError(true);
  };

  // Generate initials from name for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get the avatar URL with proper fallback handling
  const getAvatarUrl = () => {
    if (!avatarUrl || avatarError) {
      // Use a more reliable placeholder service or a local fallback
      return FALLBACK_AVATAR;
    }
    return avatarUrl;
  };

  if (!user) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Please log in to view and edit your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 pb-8">
        <CardTitle className="text-white">Profile</CardTitle>
      </CardHeader>

      <CardContent className="p-6 -mt-6">
        <div className="flex flex-col items-center">
          <Avatar className="w-20 h-20 border-4 border-white shadow-md dark:border-gray-800">
            <AvatarImage
              src={getAvatarUrl()}
              alt={`${name}'s profile`}
              onError={handleImageError}
            />
            <AvatarFallback className="bg-blue-600 text-white text-xl">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          <div className="mt-4 text-center">
            {editing ? (
              <div className="space-y-4">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="dark:bg-gray-700 dark:border-gray-600"
                />

                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Job Title"
                  className="dark:bg-gray-700 dark:border-gray-600"
                />

                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="resize-none dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                />

                <Input
                  value={avatarUrl}
                  onChange={(e) => {
                    setAvatarUrl(e.target.value);
                    setAvatarError(false); // Reset error when URL changes
                  }}
                  placeholder="Avatar URL"
                  className="dark:bg-gray-700 dark:border-gray-600"
                />

                <div className="flex justify-center space-x-2 mt-4">
                  <Button
                    onClick={handleSave}
                    variant="default"
                    className="flex items-center space-x-1"
                  >
                    <Check className="h-4 w-4" />
                    <span>Save</span>
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {name || "Anonymous User"}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {jobTitle || "No job title specified"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {bio || "No bio provided yet."}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {user.email}
                </p>

                <Button
                  onClick={() => setEditing(true)}
                  variant="outline"
                  className="mt-4 flex items-center space-x-1"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
