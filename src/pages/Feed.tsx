
import { useQuery } from "@apollo/client";
import { GET_POSTS_FOR_FOLLOWERS, GET_RECOMMENDATIONS } from "@/lib/graphql";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { CircleUser, Heart, MessageCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import UserRecommendations from "@/components/UserRecommendations";

const Feed = () => {
  const { loading, error, data } = useQuery(GET_POSTS_FOR_FOLLOWERS, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-0">
              <Skeleton className="h-[300px] w-full rounded-md" />
            </CardContent>
            <CardFooter className="pt-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-bold">Error loading feed</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  const posts = data?.getPostsForFollowers || [];

  // Helper function to safely format timestamps
  const formatTimestamp = (timestamp) => {
    try {
      // Check if timestamp is a valid number
      const date = new Date(parseInt(timestamp));
      // Verify if date is valid before formatting
      if (!isNaN(date.getTime())) {
        return formatDistanceToNow(date, { addSuffix: true });
      }
      return "some time ago"; // Fallback for invalid dates
    } catch (error) {
      console.error("Error formatting timestamp:", error, timestamp);
      return "some time ago"; // Fallback
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-8">
        <h1 className="text-2xl font-bold">Your Feed</h1>
        
        {posts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <h3 className="text-xl font-semibold mb-2">Your feed is empty</h3>
              <p className="text-muted-foreground text-center mb-4">
                Follow other users to see their posts here, or check out the Explore page to discover content.
              </p>
              <Button asChild>
                <Link to="/explore">Explore Content</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post._id} className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex items-center gap-3">
                  <Link to={`/profile/${post.owner.username}`}>
                    <Avatar>
                      <AvatarImage src={post.owner.profile_photo} alt={post.owner.username} />
                      <AvatarFallback>
                        <CircleUser className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link to={`/profile/${post.owner.username}`} className="font-medium hover:underline">
                      {post.owner.username}
                    </Link>
                    <p className="text-muted-foreground text-xs">
                      {formatTimestamp(post.timestamp)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-0">
                {post.description && <p className="mb-4">{post.description}</p>}
                <img 
                  src={`http://localhost:4000${post.imagePath}`} 
                  alt="Post" 
                  className="rounded-md w-full object-cover max-h-[500px]" 
                />
              </CardContent>
              <CardFooter className="pt-4">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Heart className="h-5 w-5" />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Share2 className="h-5 w-5" />
                    Share
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      <div className="hidden md:block">
        <UserRecommendations />
      </div>
    </div>
  );
};

export default Feed;
