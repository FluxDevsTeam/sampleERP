import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faArrowLeft,
  faArrowRight,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import { getWorkerDetails } from "@/utils/jsonDataService";

interface Payment {
  id: number;
  amount: number;
  date: string;
}

interface ProductItem {
  id: number;
  date: string;
  product: {
    id: number;
    name: string;
    project: number;
    selling_price: number;
    progress: number;
  };
}

const WorkDetails: React.FC = () => {
  const { workerType, id } = useParams<{ workerType: string; id: string }>();

  const navigate = useNavigate();
  const [paymentPage, setPaymentPage] = React.useState(1);
  const [productPage, setProductPage] = React.useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWorkerDetails = async (type: string, workerId: string, paymentPage: number, productPage: number) => {
    try {
      const data = await getWorkerDetails(type, workerId, paymentPage, productPage);
      return data;
    } catch (error) {
      console.error(`Error fetching worker details:`, error);
      throw error;
    }
  };

  const { data: workerDetails, isLoading: isLoadingWorkerDetails, isError: isErrorWorkerDetails } = useQuery({
    queryKey: ['workerDetails', workerType, id, paymentPage, productPage],
    queryFn: () => fetchWorkerDetails(workerType!, id!, paymentPage, productPage),
    enabled: !!workerType && !!id,
  });

  const paymentsData = workerDetails?.payments;
  const productsData = workerDetails?.products;

  const isLoadingPayments = isLoadingWorkerDetails;
  const isLoadingProducts = isLoadingWorkerDetails;
  const isErrorPayments = isErrorWorkerDetails;
  const isErrorProducts = isErrorWorkerDetails;

  if (isLoadingPayments || isLoadingProducts || isLoadingWorkerDetails) return <div>Loading...</div>;

  if (isErrorPayments || isErrorProducts || isErrorWorkerDetails) return <div>Error loading data.</div>;  
    return (
      <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Button onClick={() => {
          setIsLoading(true);
          navigate(-1);
        }} disabled={isLoading} className="mr-4 px-4 py-2 bg-gray-200 text-black-800 rounded-md hover:bg-gray-300">
          {isLoading ? <span>Loading...</span> : "Back"}
        </Button>
        <h1 className="md:text-2xl text-base font-bold">Work Details for {workerDetails?.first_name} {workerDetails?.last_name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section>
            <h2 className="text-xl font-semibold mb-2">Payments</h2>
        {isLoadingPayments ? (
          <div className="h-full flex items-center w-1/5 mx-auto">
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#60A5FA"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : paymentsData?.results?.length > 0 ? (
          <Table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="bg-blue-400 text-white hover:bg-blue-400">
                <TableHead className="py-2 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold text-white">Date</TableHead>
                <TableHead className="py-2 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold text-white">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentsData.results.map((payment: Payment) => (
                <TableRow key={payment.id} className="hover:bg-gray-100">
                  <TableCell className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">{payment.amount}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              <FontAwesomeIcon icon={faBoxOpen} className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">No payments found</h2>
            <p className="text-gray-500 mb-6 text-center max-w-xs">All your payments will show up here.</p>
          </div>
        )}
        <div className="flex justify-center items-center mb-4 gap-1 sm:gap-2 mt-4">
          <Button
            onClick={() => setPaymentPage(1)}
            disabled={paymentPage === 1}
            className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </Button>
          <Button
            onClick={() => setPaymentPage((prev) => Math.max(1, prev - 1))}
            disabled={paymentPage === 1}
            className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
          <span className="mx-2 sm:mx-4 text-xs sm:text-sm">
            Page {paymentPage} of {paymentsData?.last_page || 1}
          </span>
          <Button
            onClick={() => setPaymentPage((prev) => prev + 1)}
            disabled={paymentPage >= Math.ceil((paymentsData?.count || 1) / 10) || Math.ceil((paymentsData?.count || 1) / 10) === 1}
            className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
          <Button
            onClick={() => setPaymentPage(Math.ceil((paymentsData?.count || 1) / 10))}
            disabled={paymentPage >= Math.ceil((paymentsData?.count || 1) / 10) || Math.ceil((paymentsData?.count || 1) / 10) === 1}
            className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
          >
            <FontAwesomeIcon icon={faAnglesRight} />
          </Button>
          </div>
        </section>
   
        <section>
           <h2 className="text-xl font-semibold mb-2">Products</h2>
        {isLoadingProducts ? (
          <div className="h-full flex items-center w-1/5 mx-auto">
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#60A5FA"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : productsData?.results?.length > 0 ? (
          <Table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="bg-blue-400 text-white hover:bg-blue-400">
                <TableHead className="py-2 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold text-white">Name</TableHead>
                {workerType === 'contractors' && (
                  <TableHead className="py-2 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold text-white">Amount</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsData.results.map((product: ProductItem) => (
                <TableRow key={product.id} className="hover:bg-gray-100">
                  <TableCell className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">{product.product.name}</TableCell>
                  {workerType === 'contractors' && (
                    <TableCell className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">{product.product.selling_price}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              <FontAwesomeIcon icon={faBoxOpen} className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">No products found</h2>
            <p className="text-gray-500 mb-6 text-center max-w-xs">All your products will show up here.</p>
          </div>
        )}
        <div className="flex justify-center items-center mb-20 md:mb-10 gap-1 sm:gap-2 mt-4">
          <Button
            onClick={() => setProductPage(1)}
            disabled={productPage === 1}
            className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </Button>
          <Button
            onClick={() => setProductPage((prev) => Math.max(1, prev - 1))}
            disabled={productPage === 1}
            className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
          <span className="mx-2 sm:mx-4 text-xs sm:text-sm">
            Page {productPage} of {productsData?.last_page || 1}
          </span>
          <Button
            onClick={() => setProductPage((prev) => prev + 1)}
            disabled={productPage >= Math.ceil((productsData?.count || 1) / 10) || Math.ceil((productsData?.count || 1) / 10) === 1}
            className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
          <Button
            onClick={() => setProductPage(Math.ceil((productsData?.count || 1) / 10))}
            disabled={productPage >= Math.ceil((productsData?.count || 1) / 10) || Math.ceil((productsData?.count || 1) / 10) === 1}
            className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
          >
            <FontAwesomeIcon icon={faAnglesRight} />
          </Button>
        </div>
      </section>
    </div>
    </div>
  );
};

export default WorkDetails;