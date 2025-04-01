
import { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SEARCH_USERS, FOLLOW_USER, UNFOLLOW_USER, GET_FOLLOWERS, GET_FOLLOWING } from "@/lib/graphql";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CircleUser, Loader2, Search, UserPlus, UserMinus, X } from "lucide-react";
import { Link } from "react-router-dom";

const UserSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchUsers, { data, loading }] = useLazyQuery(SEARCH_USERS, {
    variables: { searchTerm },
    fetchPolicy: "network-only",
  });
  
  const [getFollowers, { data: followersData }] = useLazyQuery(GET_FOLLOWERS, {
    variables: { username: user?.username },
    fetchPolicy: "network-only",
  });
  
  const [getFollowing, { data: followingData }] = useLazyQuery(GET_FOLLOWING, {
    variables: { username: user?.username },
    fetchPolicy: "network-only",
  });
  
  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "User followed successfully",
      });
      getFollowers();
      getFollowing();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
  
  const [unfollowUser, { loading: unfollowLoading }] = useMutation(UNFOLLOW_USER, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "User unfollowed successfully",
      });
      getFollowers();
      getFollowing();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length >= 2) {
      searchUsers();
    }
  };
  
  const handleFollow = (username: string) => {
    followUser({
      variables: {
        target: username,
      },
    });
  };
  
  const handleUnfollow = (username: string) => {
    unfollowUser({
      variables: {
        target: username,
      },
    });
  };
  
  const isFollowing = (username: string) => {
    if (!followingData?.getFollowing) return false;
    return followingData.getFollowing.includes(username);
  };
  
  const isFollower = (username: string) => {
    if (!followersData?.getFollowers) return false;
    return followersData.getFollowers.includes(username);
  };
  
  // Fetch follow data when dialog opens
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      getFollowers();
      getFollowing();
    }
  };
  
  const users = data?.searchUsers || [];
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-start text-muted-foreground"
        onClick={() => handleOpenChange(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search users...</span>
      </Button>
      
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSearchTerm("")}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CommandList>
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : searchTerm.length < 2 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              Type at least 2 characters to search
            </div>
          ) : users.length === 0 ? (
            <CommandEmpty>No users found</CommandEmpty>
          ) : (
            <CommandGroup>
              {users.map((user) => (
                <CommandItem 
                  key={user._id}
                  className="flex items-center justify-between p-2"
                  onSelect={() => {}}
                >
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.profile_photo} alt={user.username} />
                      <AvatarFallback>
                        <CircleUser className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link 
                        to={`/profile/${user.username}`}
                        onClick={() => setOpen(false)}
                        className="font-medium hover:underline"
                      >
                        {user.username}
                      </Link>
                      {isFollower(user.username) && (
                        <p className="text-xs text-muted-foreground">Follows you</p>
                      )}
                    </div>
                  </div>
                  
                  {user.username !== user?.username && (
                    isFollowing(user.username) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-auto flex items-center gap-1 h-8"
                        onClick={() => handleUnfollow(user.username)}
                        disabled={unfollowLoading}
                      >
                        {unfollowLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <UserMinus className="h-3 w-3" />
                        )}
                        Unfollow
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="ml-auto flex items-center gap-1 h-8"
                        onClick={() => handleFollow(user.username)}
                        disabled={followLoading}
                      >
                        {followLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <UserPlus className="h-3 w-3" />
                        )}
                        {isFollower(user.username) ? "Follow Back" : "Follow"}
                      </Button>
                    )
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default UserSearch;
