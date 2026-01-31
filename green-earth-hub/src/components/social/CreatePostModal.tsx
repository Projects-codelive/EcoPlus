import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Image, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const remainingSlots = 3 - images.length;

            if (selectedFiles.length > remainingSlots) {
                toast.error(`You can only upload a maximum of 3 images.`);
                return;
            }

            const newFiles = selectedFiles.slice(0, remainingSlots);
            setImages([...images, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls([...previewUrls, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...previewUrls];
        URL.revokeObjectURL(newPreviews[index]); // Cleanup
        newPreviews.splice(index, 1);
        setPreviewUrls(newPreviews);
    };

    const handleSubmit = async () => {
        if (!content.trim() && images.length === 0) {
            toast.error("Please add some text or images.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('content', content);
        images.forEach(image => {
            formData.append('images', image);
        });

        try {
            const response = await fetch('http://localhost:5000/api/social/create', {
                method: 'POST',
                body: formData, // fetch automatically sets Content-Type to multipart/form-data
                credentials: 'include'
            });

            if (response.ok) {
                toast.success("Post created!");
                // Reset
                setContent('');
                setImages([]);
                setPreviewUrls([]);
                onClose();
            } else {
                const err = await response.json();
                toast.error(err.message || 'Failed to create post');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Post</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Textarea
                        placeholder="What's on your eco-mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="resize-none min-h-[100px]"
                    />

                    {/* Image Previews */}
                    {previewUrls.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {previewUrls.map((url, idx) => (
                                <div key={idx} className="relative w-20 h-20 shrink-0">
                                    <img src={url} alt="preview" className="w-full h-full object-cover rounded-md" />
                                    <button
                                        onClick={() => removeImage(idx)}
                                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-md"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center border-t pt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={images.length >= 3}
                        >
                            <Image size={20} className="mr-2" />
                            Add Photo
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                        />

                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Post
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
