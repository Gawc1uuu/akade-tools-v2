/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus } from 'lucide-react';

import InvoiceItem from '@/app/(pages)/invoices/invoice-item';
import { useInvoice } from '@/app/context/invoice-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ItemsList = () => {
  const { invoice, addItem } = useInvoice();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invoice Items</CardTitle>
        <Button onClick={addItem} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {invoice.items.map((item, index) => (
          <InvoiceItem key={item.id} item={item} index={index} canRemove={invoice.items.length > 1} />
        ))}
      </CardContent>
    </Card>
  );
};

export default ItemsList;
