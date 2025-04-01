
import { useQuery, useMutation } from "@apollo/client";
import { GET_RECOMMENDATIONS, FOLLOW_USER } from "@/lib/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleUser, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const UserRecommendations = () => {
  const { toast } = useToast();
  const { loading, error, data, refetch } = useQuery(GET_RECOMMENDATIONS);
  
  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "User followed successfully",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleFollow = (username: string) => {
    followUser({
      variables: {
        target: username,
      },
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suggested for you</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-9 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suggested for you</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unable to load recommendations</p>
        </CardContent>
      </Card>
    );
  }

  const recommendations = data?.getRecommendations || [];

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suggested for you</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recommendations available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested for you</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            <Link to={`/profile/${user.username}`} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.profile_photo} alt={user.username} />
                <AvatarFallback>
                  <CircleUser className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user.username}</p>
                <p className="text-muted-foreground text-xs">Suggested for you</p>
              </div>
            </Link>
            <Button size="sm" variant="outline" className="gap-1" onClick={() => handleFollow(user.username)}>
              <Plus className="h-4 w-4" />
              Follow
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserRecommendations;
