
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { ArrowLeft, MoreHorizontal, Eye, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { deleteDocument } from '@/lib/actions';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: {
    toDate: () => Date;
  };
  status: string;
}

const statusVariant: { [key: string]: 'default' | 'secondary' | 'outline' } = {
  New: 'default',
  Read: 'outline',
  Replied: 'secondary',
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async () => {
      if (!user) {
          setLoading(false);
          return;
      }
      setLoading(true);
      try {
          const q = query(
            collection(db, 'contacts'),
            orderBy('submittedAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const messagesData: Message[] = [];
          querySnapshot.forEach(doc => {
              messagesData.push({ id: doc.id, ...doc.data() } as Message);
          });
          setMessages(messagesData);
      } catch (error) {
          console.error("Error fetching messages: ", error);
          toast({ title: "Error", description: "Failed to fetch messages.", variant: "destructive" });
      } finally {
          setLoading(false);
      }
  };
  
  useEffect(() => {
    fetchMessages();
  }, [user]);

  const handleDelete = async (messageId: string) => {
    const result = await deleteDocument('contacts', messageId);
    if (result.success) {
      toast({ title: "Success", description: "Message deleted successfully." });
      fetchMessages(); // Refresh the list
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
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Manage messages from your contact form.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead className="hidden md:table-cell">Message</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-32 mt-1 hidden md:block" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  {user ? "No messages yet." : "Please log in to view messages."}
                </TableCell>
              </TableRow>
            ) : (
              messages.map(message => (
                <TableRow key={message.id}>
                  <TableCell>
                    <div className="font-medium">{message.name}</div>
                    <div className="text-sm text-muted-foreground hidden md:inline">
                      {message.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-sm">
                    <p className="truncate">{message.message}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={statusVariant[message.status] || 'secondary'}>
                      {message.status}
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
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/messages/${message.id}`}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" /> View Message
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                        <DropdownMenuSeparator />
                         <ConfirmationDialog
                            title="Are you sure?"
                            description="This will permanently delete the message. This action cannot be undone."
                            onConfirm={() => handleDelete(message.id)}
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
  );
}
