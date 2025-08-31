
'use client'
import { useState, useEffect } from 'react';
import Link from "next/link"
import Image from "next/image"
import { useAuth } from '@/hooks/use-auth';
import { MoreHorizontal, ArrowLeft, CheckCircle, XCircle, Eye, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { deleteDocument } from '@/lib/actions';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';


interface Story {
  id: string;
  name: string;
  title: string;
  story: string;
  submittedAt: Timestamp;
  status: 'Pending' | 'Approved' | 'Rejected';
  imageUrl?: string;
  dataAiHint?: string;
}


const statusVariant: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
  Approved: 'default',
  Pending: 'secondary',
  Rejected: 'destructive',
};


export default function SuccessStoriesPage() {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();

    const fetchStories = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const q = query(
              collection(db, 'success_stories'),
              orderBy('submittedAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const storiesData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            })) as Story[];
            setStories(storiesData);
        } catch (error) {
            console.error("Error fetching success stories: ", error);
            toast({ title: "Error", description: "Failed to fetch success stories.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(user) {
            fetchStories();
        }
    }, [user]);

    const handleDelete = async (storyId: string) => {
      const result = await deleteDocument('success_stories', storyId);
      if (result.success) {
        toast({ title: "Success", description: "Story deleted successfully." });
        fetchStories(); // Refresh the list
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/admin/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
          </Link>
          </Button>
          <div>
              <CardTitle>Success Stories</CardTitle>
              <CardDescription>
              Review, approve, and manage client testimonials.
              </CardDescription>
          </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell">
                        <Skeleton className="aspect-square rounded-md h-16 w-16" />
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : stories.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                        {user ? "No success stories submitted yet." : "Please log in to view stories."}
                    </TableCell>
                </TableRow>
            ) : (
                stories.map((story) => (
                    <TableRow key={story.id}>
                     <TableCell className="hidden sm:table-cell">
                        <Image
                            alt={story.title || "Author image"}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={story.imageUrl || "https://picsum.photos/100/100"}
                            width="64"
                            data-ai-hint={story.dataAiHint || "person"}
                        />
                     </TableCell>
                    <TableCell className="font-medium">{story.name}</TableCell>
                    <TableCell>{story.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                         {story.submittedAt && typeof story.submittedAt.toDate === 'function' 
                            ? format(story.submittedAt.toDate(), 'PPP') 
                            : 'N/A'}
                    </TableCell>
                    <TableCell>
                        <Badge variant={statusVariant[story.status] || 'secondary'}>
                            {story.status}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                               <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-green-600 focus:text-green-700">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                              title="Are you sure?"
                              description="This will permanently delete the success story. This action cannot be undone."
                              onConfirm={() => handleDelete(story.id)}
                            >
                               <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                            </ConfirmationDialog>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
