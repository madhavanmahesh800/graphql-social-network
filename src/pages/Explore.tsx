
import { useQuery, useMutation } from "@apollo/client";
import { GET_RECOMMENDATIONS, FOLLOW_USER } from "@/lib/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CircleUser, Loader2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const Explore = () => {
  const { toast } = useToast();
  const { loading, error, data, refetch } = useQuery(GET_RECOMMENDATIONS, {
    fetchPolicy: "network-only",
  });

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
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold">Error loading recommendations</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  const recommendations = data?.getRecommendations || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Explore</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-8 text-center">
              <CircleUser className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No recommendations found</h3>
              <p className="text-muted-foreground">
                We couldn't find any users to recommend at this time. Try again later.
              </p>
            </CardContent>
          </Card>
        ) : (
          recommendations.map((user) => (
            <Card key={user._id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{user.username}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.profile_photo} alt={user.username} />
                    <AvatarFallback>
                      <CircleUser className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {user.description || "No bio available"}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    asChild 
                    variant="outline" 
                    className="flex-1"
                  >
                    <Link to={`/profile/${user.username}`}>
                      View Profile
                    </Link>
                  </Button>
                  <Button 
                    className="flex-1 gap-1" 
                    onClick={() => handleFollow(user.username)}
                    disabled={followLoading}
                  >
                    {followLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Explore;
