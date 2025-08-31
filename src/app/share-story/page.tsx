import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import Link from 'next/link';

export default function ShareStoryPage() {
    return (
        <div className="bg-secondary py-16 md:py-24">
            <div className="container">
                <Card className="max-w-2xl mx-auto bg-background shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-4xl">Share Your Success Story</CardTitle>
                        <CardDescription className="text-lg mt-2">
                            Inspire others with your fitness journey. Your story could be featured on our home page!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                             <div className="grid gap-3">
                                <Label htmlFor="name">Your Name</Label>
                                <Input id="name" placeholder="e.g., John D." />
                            </div>
                             <div className="grid gap-3">
                                <Label htmlFor="title">Story Title</Label>
                                <Input id="title" placeholder="e.g., How I Lost 30 Pounds" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="story">Your Story</Label>
                                <Textarea id="story" placeholder="Share the details of your transformation..." className="min-h-48" />
                            </div>
                             <div className="grid gap-3">
                                <Label htmlFor="photo">Your Photo (Optional)</Label>
                                <div className="flex items-center gap-4">
                                     <div
                                        className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed"
                                        >
                                        <Button variant="ghost" size="icon" asChild>
                                        <div>
                                            <Upload className="h-8 w-8 text-muted-foreground" />
                                            <span className="sr-only">Upload</span>
                                        </div>
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Upload a before/after or a current photo of yourself.</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <Button asChild variant="link">
                                    <Link href="/">Cancel</Link>
                                </Button>
                                <Button size="lg">Submit for Review</Button>
                            </div>
                             <p className="text-xs text-muted-foreground text-center pt-2">
                                By submitting, you agree to let FitEdge use your story and photo for marketing purposes. All submissions are reviewed by our team before publishing.
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
