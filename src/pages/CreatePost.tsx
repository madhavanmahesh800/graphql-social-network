
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "@/lib/graphql";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreatePost = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      toast({
        title: "Post created",
        description: "Your post has been created successfully",
      });
      navigate("/feed");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an image",
      });
      return;
    }

    try {
      setUploadingFile(true);
      
      // Upload the file first
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadResponse = await fetch("http://localhost:4000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      
      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Failed to upload file");
      }

      // Then create the post with the returned file path
      await createPost({
        variables: {
          imagePath: uploadResult.filePath,
          description,
        },
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create a new post</CardTitle>
          <CardDescription>Share a photo with your followers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            
            {preview && (
              <div className="mt-4 relative aspect-video rounded-md overflow-hidden border bg-muted">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="object-cover w-full h-full" 
                />
              </div>
            )}
            
            {!preview && (
              <div className="flex items-center justify-center border border-dashed rounded-md h-52 bg-muted/50">
                <div className="text-center p-4">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No image selected</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Write a description for your post..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => navigate("/feed")}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading || uploadingFile || !file}
              className="gap-2"
            >
              {(loading || uploadingFile) && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading || uploadingFile ? "Uploading..." : "Create Post"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreatePost;
