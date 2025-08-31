
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: { toDate: () => Date };
}

export default function MessageDetailPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      if (params.id) {
        const docRef = doc(db, 'contacts', params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const messageData = { id: docSnap.id, ...docSnap.data() } as Message;
          setMessage(messageData);
          setFormattedDate(messageData.submittedAt.toDate().toLocaleString());
        } else {
          notFound();
        }
        setLoading(false);
      }
    };
    fetchMessage();
  }, [params.id]);

  if (loading) {
    return (
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-7 w-7" />
                <Skeleton className="h-7 w-48" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-5 w-80 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                         <Separator />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-20" />
                </CardFooter>
            </Card>
        </div>
    );
  }

  if (!message) {
    return notFound();
  }

  return (
    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/admin/messages">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Message Details
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>From: {message.name}</CardTitle>
          <CardDescription>
            Full message content from the contact form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <a
                href={`mailto:${message.email}`}
                className="text-primary hover:underline"
              >
                {message.email}
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Received:</span>
              <span className="font-medium">
                {formattedDate}
              </span>
            </div>
            <Separator />
            <p className="text-base leading-relaxed">{message.message}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">Mark as Read</Button>
          <Button>Reply</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
