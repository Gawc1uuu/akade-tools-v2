import React from 'react';

import { useInvoice } from '@/app/context/invoice-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BasicDetails = () => {
  const { invoice, updateInvoice } = useInvoice();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
            value={invoice.invoiceNumber}
            id="invoiceNumber"
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input onChange={(e) => updateInvoice({ date: e.target.value })} value={invoice.date} id="date" type="date" />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicDetails;
