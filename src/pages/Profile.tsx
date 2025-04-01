
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_USER_PROFILE, FOLLOW_USER, UNFOLLOW_USER, GET_FOLLOWERS, GET_FOLLOWING } from "@/lib/graphql";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { CircleUser, Edit, UserPlus, UserMinus, UserCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UPDATE_PROFILE } from "@/lib/graphql";
import { Link } from "react-router-dom";

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowedBy, setIsFollowedBy] = useState(false);
  const [description, setDescription] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { username },
    fetchPolicy: "network-only",
  });

  const { data: followersData, refetch: refetchFollowers } = useQuery(GET_FOLLOWERS, {
    variables: { username },
    fetchPolicy: "network-only",
  });

  const { data: followingData, refetch: refetchFollowing } = useQuery(GET_FOLLOWING, {
    variables: { username },
    fetchPolicy: "network-only",
  });

  const { data: myFollowingData, refetch: refetchMyFollowing } = useQuery(GET_FOLLOWING, {
    variables: { username: user?.username },
    skip: !user?.username,
    fetchPolicy: "network-only",
  });

  const { data: myFollowersData, refetch: refetchMyFollowers } = useQuery(GET_FOLLOWERS, {
    variables: { username: user?.username },
    skip: !user?.username,
    fetchPolicy: "network-only",
  });

  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    onCompleted: () => {
      setIsFollowing(true);
      toast({
        title: "Success",
        description: `You are now following ${username}`,
      });
      refetchFollowers();
      refetchMyFollowing();
    },
    onError: (error) => {
      console.error("Follow error:", error);
    },
  });

  const [unfollowUser, { loading: unfollowLoading }] = useMutation(UNFOLLOW_USER, {
    onCompleted: () => {
      setIsFollowing(false);
      toast({
        title: "Success",
        description: `You have unfollowed ${username}`,
      });
      refetchFollowers();
      refetchMyFollowing();
    },
    onError: (error) => {
      console.error("Unfollow error:", error);
    },
  });

  const [updateProfile, { loading: updateLoading }] = useMutation(UPDATE_PROFILE, {
    onCompleted: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      refetch();
      setDialogOpen(false);
    },
    onError: (error) => {
      console.error("Update profile error:", error);
    },
  });

  useEffect(() => {
    if (myFollowingData?.getFollowing && username) {
      const following = myFollowingData.getFollowing || [];
      setIsFollowing(following.includes(username));
    }
  }, [myFollowingData, username]);

  useEffect(() => {
    if (myFollowersData?.getFollowers && username) {
      const followers = myFollowersData.getFollowers || [];
      setIsFollowedBy(followers.includes(username));
    }
  }, [myFollowersData, username]);

  useEffect(() => {
    if (data?.getUserProfile) {
      setDescription(data.getUserProfile.description || "");
      setProfilePhoto(data.getUserProfile.profile_photo || "");
    }
  }, [data]);

  const handleFollow = () => {
    followUser({
      variables: {
        target: username,
      },
    });
  };

  const handleUnfollow = () => {
    unfollowUser({
      variables: {
        target: username,
      },
    });
  };

  const handleProfileUpdate = () => {
    updateProfile({
      variables: {
        description,
        profilePhoto,
      },
    });
  };

  const refetchAll = () => {
    refetch();
    refetchFollowers();
    refetchFollowing();
    if (user?.username) {
      refetchMyFollowers();
      refetchMyFollowing();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    console.error("Profile error:", error);
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold">Error loading profile</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  const profile = data?.getUserProfile;
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold">User not found</h2>
          <p className="text-muted-foreground">The profile you are looking for does not exist</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.username === username;
  const followers = followersData?.getFollowers || [];
  const following = followingData?.getFollowing || [];

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={profile.profile_photo} alt={profile.username} />
              <AvatarFallback className="text-2xl">
                <CircleUser className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h1 className="text-2xl font-bold">{profile.username}</h1>
                <p className="text-muted-foreground">{profile.description || "No bio yet"}</p>
              </div>
              
              <div className="flex gap-4 justify-center md:justify-start">
                <div>
                  <p className="font-bold">Followers</p>
                  <p className="text-muted-foreground">{followers.length}</p>
                </div>
                <div>
                  <p className="font-bold">Following</p>
                  <p className="text-muted-foreground">{following.length}</p>
                </div>
              </div>
              
              <div>
                {isOwnProfile ? (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                          Update your profile information here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="profile-photo">Profile Photo URL</Label>
                          <Input
                            id="profile-photo"
                            value={profilePhoto}
                            onChange={(e) => setProfilePhoto(e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Bio</Label>
                          <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell us about yourself"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleProfileUpdate} disabled={updateLoading}>
                          {updateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                    {isFollowing ? (
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={handleUnfollow}
                        disabled={unfollowLoading}
                      >
                        {unfollowLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserMinus className="h-4 w-4" />
                        )}
                        Unfollow
                      </Button>
                    ) : (
                      <Button
                        className="gap-2"
                        onClick={handleFollow}
                        disabled={followLoading}
                      >
                        {followLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isFollowedBy ? (
                          <UserCheck className="h-4 w-4" />
                        ) : (
                          <UserPlus className="h-4 w-4" />
                        )}
                        {isFollowedBy ? "Follow Back" : "Follow"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="followers">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        
        <TabsContent value="followers" className="pt-4">
          <div className="space-y-4">
            {followers.length === 0 ? (
              <Card className="flex items-center justify-center p-8 text-center">
                <p className="text-muted-foreground">No followers yet</p>
              </Card>
            ) : (
              followers.map((follower) => (
                <Card key={follower}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <Link to={`/profile/${follower}`} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          <CircleUser className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{follower}</p>
                      </div>
                    </Link>
                    
                    {follower !== user?.username && (
                      myFollowingData?.getFollowing?.includes(follower) ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => {
                            unfollowUser({ variables: { target: follower } });
                          }}
                        >
                          <UserMinus className="h-4 w-4" />
                          Unfollow
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="gap-1"
                          onClick={() => {
                            followUser({ variables: { target: follower } });
                          }}
                        >
                          <UserPlus className="h-4 w-4" />
                          Follow
                        </Button>
                      )
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="following" className="pt-4">
          <div className="space-y-4">
            {following.length === 0 ? (
              <Card className="flex items-center justify-center p-8 text-center">
                <p className="text-muted-foreground">Not following anyone</p>
              </Card>
            ) : (
              following.map((followedUser) => (
                <Card key={followedUser}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <Link to={`/profile/${followedUser}`} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          <CircleUser className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{followedUser}</p>
                      </div>
                    </Link>
                    
                    {followedUser !== user?.username && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => {
                          unfollowUser({ variables: { target: followedUser } });
                        }}
                      >
                        <UserMinus className="h-4 w-4" />
                        Unfollow
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
