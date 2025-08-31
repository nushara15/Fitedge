
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, Calendar, User, MessageSquare, Phone, Dumbbell } from 'lucide-react';
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
import { format } from 'date-fns';

interface Purchase {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
  serviceName: string;
  goal: string;
  submittedAt?: { toDate: () => Date };
}

export default function PurchaseDetailPage({ params }: { params: { id: string } }) {
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState('N/A');

  useEffect(() => {
    const fetchPurchase = async () => {
      if (params.id) {
        setLoading(true);
        try {
            const docRef = doc(db, 'purchases', params.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const purchaseData = { id: docSnap.id, ...docSnap.data() } as Purchase;
              setPurchase(purchaseData);
              if (purchaseData.submittedAt && typeof purchaseData.submittedAt.toDate === 'function') {
                setFormattedDate(format(purchaseData.submittedAt.toDate(), 'PPP p'));
              }
            } else {
              notFound();
            }
        } catch (error) {
            console.error("Error fetching purchase details:", error);
            notFound();
        } finally {
            setLoading(false);
        }
      }
    };
    fetchPurchase();
  }, [params.id]);

  if (loading) {
    return (
        <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
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
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Separator />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </CardContent>
                 <CardFooter className="flex justify-end gap-2">
                    <Skeleton className="h-10 w-32" />
                </CardFooter>
            </Card>
        </div>
    );
  }

  if (!purchase) {
    return notFound();
  }

  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/admin/purchases">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Inquiry Details
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inquiry from {`${purchase.firstName} ${purchase.lastName}`}</CardTitle>
          <CardDescription>
            Full details of the service inquiry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-medium">{`${purchase.firstName} ${purchase.lastName}`}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Received:</span>
                    <span className="font-medium">{formattedDate}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <a href={`mailto:${purchase.email}`} className="font-medium text-primary hover:underline">{purchase.email}</a>
                </div>
                 <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">WhatsApp:</span>
                    <a href={`https://wa.me/${purchase.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" className="font-medium text-primary hover:underline">{purchase.whatsappNumber}</a>
                </div>
                 <div className="flex items-center gap-3 col-span-full">
                    <Dumbbell className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">{purchase.serviceName}</span>
                </div>
            </div>
            <Separator />
             <div>
                <h3 className="font-semibold text-base mb-2 flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    Client's Goal
                </h3>
                <p className="text-base leading-relaxed bg-secondary p-4 rounded-md">{purchase.goal}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button>Mark as Contacted</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
