import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, DollarSign, TrendingUp, Calendar, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { axiosInstance } from '@/api/axios/axiosInstance';

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Memoized stats to avoid recalculation on every render
  const paymentStats = useMemo(() => {
    const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const completedPayments = payments.filter(p => p.paymentStatus === "paid").length;
    const pendingPayments = payments.filter(p => p.paymentStatus !== "paid").length;
    const uniquePaymentMethods = new Set(payments.map(p => p.paymentMethod)).size;
    
    return {
      totalRevenue,
      completedPayments,
      pendingPayments,
      uniquePaymentMethods
    };
  }, [payments]);

  // Optimized fetch function with useCallback to prevent unnecessary re-renders
  const fetchPayments = useCallback(async (page = pagination.currentPage, limit = pagination.itemsPerPage, search = debouncedSearchTerm) => {
    try {
      // Show search loading only if it's a search operation
      if (search !== debouncedSearchTerm) {
        setSearchLoading(true);
      }
      
      const response = await axiosInstance.get('/getAllPayments', {
        params: {
          page,
          limit,
          search: search.trim(),
        },
      });
      
      setPayments(response.data.data.payments || []);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        itemsPerPage: limit,
        totalItems: response.data.data.pagination?.totalItems || 0,
        totalPages: response.data.data.pagination?.totalPages || 0,
      }));
      setError(null);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to fetch payments. Please try again later.');
      setPayments([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [debouncedSearchTerm, pagination.currentPage, pagination.itemsPerPage]);

  // Effect for initial load and search term changes
  useEffect(() => {
    fetchPayments(1, pagination.itemsPerPage, debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Effect for pagination changes (without search term)
  useEffect(() => {
    if (!loading) {
      fetchPayments(pagination.currentPage, pagination.itemsPerPage, debouncedSearchTerm);
    }
  }, [pagination.currentPage, pagination.itemsPerPage]);

  const handlePageChange = useCallback((page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  const handleItemsPerPageChange = useCallback((value) => {
    const newItemsPerPage = parseInt(value, 10);
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      itemsPerPage: newItemsPerPage
    }));
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Generate page numbers for pagination
  const getPageNumbers = useMemo(() => {
    const pages = [];
    const { currentPage, totalPages } = pagination;
    
    // Always show first page
    if (totalPages > 0) pages.push(1);
    
    // Calculate range around current page
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    
    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...');
    }
    
    // Add pages around current page
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  }, [pagination.currentPage, pagination.totalPages]);

  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  }, []);

  if (loading && payments.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
            <p className="text-muted-foreground">Track and manage payment transactions</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-[150px]" />
                  <Skeleton className="h-3 w-[100px] mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-[300px]" />
                  <Skeleton className="h-10 w-[120px]" />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {[...Array(7)].map((_, i) => (
                        <TableHead key={i}>
                          <Skeleton className="h-4 w-full" />
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {[...Array(7)].map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
            <p className="text-muted-foreground">Track and manage payment transactions</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchPayments();
                }}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">
            Track and manage payment transactions
          </p>
        </div>

        {/* Payment Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-2xl font-bold tracking-tight mb-1">&#8377;{paymentStats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Payments</CardTitle>
              <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-2xl font-bold tracking-tight mb-1">{paymentStats.completedPayments}</div>
              <p className="text-xs text-muted-foreground">
                Successful transactions
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
              <div className="h-8 w-8 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-2xl font-bold tracking-tight mb-1">{paymentStats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Payment Methods</CardTitle>
              <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-2xl font-bold tracking-tight mb-1">{paymentStats.uniquePaymentMethods}</div>
              <p className="text-xs text-muted-foreground">
                Active methods
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>
              A list of recent payment transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Items Per Page Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by order ID or customer name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 h-10 border-input bg-background hover:border-ring transition-colors"
                />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md border">
                <span className="text-sm font-medium whitespace-nowrap text-muted-foreground">Show:</span>
                <Select
                  value={pagination.itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-[70px] h-8 border-0 bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b bg-muted/50">
                    <TableHead className="font-semibold text-foreground">Payment ID</TableHead>
                    <TableHead className="font-semibold text-foreground">Order ID</TableHead>
                    <TableHead className="font-semibold text-foreground">Customer</TableHead>
                    <TableHead className="text-right font-semibold text-foreground">Amount</TableHead>
                    <TableHead className="font-semibold text-foreground">Method</TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-foreground">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={7} className="text-center py-12">
                        {searchTerm ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                              <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-foreground font-medium">No payments found</p>
                              <p className="text-muted-foreground text-sm">No results match "{searchTerm}". Try adjusting your search.</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSearchTerm('')}
                              className="mt-2"
                            >
                              Clear search
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                              <CreditCard className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-foreground font-medium">No payments found</p>
                              <p className="text-muted-foreground text-sm">There are no payment transactions to display.</p>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
                      <TableRow key={payment.paymentId || payment.orderId} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium font-mono text-sm">
                          {payment.paymentId || 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {payment.orderId || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {(payment.customerName || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span>{payment.customerName || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          Rs.{(payment.amount || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 bg-muted rounded flex items-center justify-center">
                              <CreditCard className="h-3 w-3" />
                            </div>
                            <span className="capitalize text-sm">
                              {payment.paymentMethod || 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`font-medium ${
                              payment.paymentStatus === "paid" 
                                ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" 
                                : payment.paymentStatus === "pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                                : payment.paymentStatus === "failed"
                                ? "bg-red-100 text-red-800 hover:bg-red-100 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full mr-1 ${
                              payment.paymentStatus === "paid" 
                                ? "bg-green-600 dark:bg-green-400" 
                                : payment.paymentStatus === "pending"
                                ? "bg-yellow-600 dark:bg-yellow-400"
                                : payment.paymentStatus === "failed"
                                ? "bg-red-600 dark:bg-red-400"
                                : "bg-gray-600 dark:bg-gray-400"
                            }`} />
                            {payment.paymentStatus || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.dateOfPayment ? formatDate(payment.dateOfPayment) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Enhanced Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                  <span className="font-medium text-foreground">{pagination.totalItems}</span> results
                </div>
                
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="h-8 px-3"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1 mx-1">
                    {getPageNumbers.map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 py-1 text-muted-foreground">...</span>
                      ) : (
                        <Button
                          key={page}
                          variant={pagination.currentPage === page ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`h-8 w-8 p-0 ${
                            pagination.currentPage === page 
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                              : 'hover:bg-muted'
                          }`}
                        >
                          {page}
                        </Button>
                      )
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="h-8 px-3"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;