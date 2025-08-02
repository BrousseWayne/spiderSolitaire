// Profile.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [nickname, setNickname] = useState("");
  const [editing, setEditing] = useState(false);
  const [defaultMode, setDefaultMode] = useState("");
  const [picture, setPicture] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/profile", {
        credentials: "include",
      });
      const data = await res.json();
      setProfile(data);
      setNickname(data.nickname || "");
      setDefaultMode(data.default_game_mode?.toString() || "");
      setPicture(data.profile_picture || "");
      setShowOnboarding(!data.hasCompletedOnboarding);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await fetch("http://localhost:3000/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nickname,
          default_game_mode: parseInt(defaultMode),
          profile_picture: picture,
        }),
      });
      setEditing(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleOnboardingSubmit = async () => {
    try {
      console.log(nickname, defaultMode, picture);
      await fetch("http://localhost:3000/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nickname: nickname || null,
          default_game_mode: defaultMode ? parseInt(defaultMode) : null,
          profile_picture: picture || null,
        }),
      });
      setShowOnboarding(false);
      fetchProfile();
    } catch (err) {
      console.error("Onboarding failed", err);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPicture(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!profile) {
    return <div className="p-4">Failed to load profile.</div>;
  }

  return (
    <div
      className={cn(
        "max-w-3xl mx-auto p-4 space-y-6",
        showOnboarding && "blur-sm pointer-events-none"
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={profile.email} disabled />
          </div>
          <div>
            <Label>Nickname</Label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={!editing}
            />
          </div>
          <div>
            <Label>Default Game Mode</Label>
            <Select
              value={defaultMode}
              onValueChange={setDefaultMode}
              disabled={!editing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Suit</SelectItem>
                <SelectItem value="2">2 Suits</SelectItem>
                <SelectItem value="4">4 Suits</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Profile Picture</Label>
            {picture && (
              <img
                src={picture}
                alt="profile"
                className="w-16 h-16 object-cover mb-2"
              />
            )}
            {editing && <Input type="file" onChange={handleFile} />}
          </div>
          {editing ? (
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setEditing(true)}>Edit</Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Game Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>Games Played: {profile.games_played}</div>
          <div>Wins (1 Suit): {profile.wins_1_suit}</div>
          <div>Losses (1 Suit): {profile.losses_1_suit}</div>
          <div>Wins (2 Suits): {profile.wins_2_suits}</div>
          <div>Losses (2 Suits): {profile.losses_2_suits}</div>
          <div>Wins (4 Suits): {profile.wins_4_suits}</div>
          <div>Losses (4 Suits): {profile.losses_4_suits}</div>
        </CardContent>
      </Card>

      <Dialog open={showOnboarding}>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              Welcome! Let’s finish setting up your profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Choose a nickname</Label>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <div>
              <Label>Pick a profile picture</Label>
              {picture && (
                <img
                  src={picture}
                  alt="preview"
                  className="w-16 h-16 object-cover mb-2"
                />
              )}
              <Input type="file" onChange={handleFile} />
            </div>
            <div>
              <Label>Choose default game mode</Label>
              <Select value={defaultMode} onValueChange={setDefaultMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Suit</SelectItem>
                  <SelectItem value="2">2 Suits</SelectItem>
                  <SelectItem value="4">4 Suits</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleOnboardingSubmit} className="w-full">
              Save & Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
