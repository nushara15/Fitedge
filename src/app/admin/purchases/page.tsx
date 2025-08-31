
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
  Timestamp,
} from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { deleteDocument } from '@/lib/actions';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';

interface Purchase {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
  serviceName: string;
  goal: string;
  submittedAt?: Timestamp;
  status: string;
}

const statusVariant: { [key: string]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
  New: 'default',
  Contacted: 'secondary',
  'Follow Up': 'outline',
  Closed: 'destructive',
};

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPurchases = async () => {
    if (!user) {
      setLoading(false);
      return;
    };

    setLoading(true);
    try {
      const q = query(
        collection(db, 'purchases'),
        orderBy('submittedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const purchasesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Purchase[];
      setPurchases(purchasesData);
    } catch (error) {
      console.error("Error fetching purchases: ", error);
       toast({ title: "Error", description: "Failed to fetch purchase inquiries.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if(user) {
      fetchPurchases();
    }
  }, [user]);

  const handleDelete = async (purchaseId: string) => {
    const result = await deleteDocument('purchases', purchaseId);
    if (result.success) {
      toast({ title: "Success", description: "Inquiry deleted successfully." });
      fetchPurchases(); // Refresh the list
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
          <CardTitle>Purchase Inquiries</CardTitle>
          <CardDescription>
            Manage inquiries for your services.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Service</TableHead>
              <TableHead className="hidden md:table-cell">Submitted</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-32 mt-1" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                   <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : purchases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  {user ? "No purchase inquiries yet." : "Please log in to view inquiries."}
                </TableCell>
              </TableRow>
            ) : (
              purchases.map(purchase => (
                <TableRow key={purchase.id}>
                  <TableCell>
                    <div className="font-medium">{`${purchase.firstName} ${purchase.lastName}`}</div>
                    <div className="text-sm text-muted-foreground">
                      {purchase.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {purchase.serviceName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {purchase.submittedAt && typeof purchase.submittedAt.toDate === 'function' 
                      ? format(purchase.submittedAt.toDate(), 'PPP') 
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={statusVariant[purchase.status] || 'secondary'}>
                      {purchase.status}
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
                            <Link href={`/admin/purchases/${purchase.id}`} className="flex items-center gap-2 cursor-pointer">
                                <Eye className="h-4 w-4" /> View Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Mark as Contacted</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ConfirmationDialog
                          title="Are you sure?"
                          description="This will permanently delete the inquiry. This action cannot be undone."
                          onConfirm={() => handleDelete(purchase.id)}
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
