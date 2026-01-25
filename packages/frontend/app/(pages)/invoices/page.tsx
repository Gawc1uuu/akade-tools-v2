'use client';

import { Eye } from 'lucide-react';
import { useState } from 'react';

import InvoiceForm from '@/app/(pages)/invoices/invoice-form';
import InvoicePreview from '@/app/(pages)/invoices/invoice-preview';
import { Button } from '@/components/ui/button';

const InvoicesPage = () => {
  const [showPreview, setShowPreview] = useState(false);

  if (showPreview) {
    return <InvoicePreview onBack={() => setShowPreview(false)} />;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Invoice Generator</h1>
            <p className="text-gray-600">Create invoices</p>
          </div>
          <Button onClick={() => setShowPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
        <InvoiceForm />
      </div>
    </div>
  );
};

export default InvoicesPage;
