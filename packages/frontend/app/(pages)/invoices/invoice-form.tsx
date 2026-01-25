import React from 'react';

import BasicDetails from '@/app/(pages)/invoices/basic-details';
import ContactDetails from '@/app/(pages)/invoices/contact-details';
import ItemsList from '@/app/(pages)/invoices/items-list';
import TaxAndTotals from '@/app/(pages)/invoices/tax-and-totals';

const InvoiceForm = () => {
  return (
    <div className="space-y-6">
      <BasicDetails />
      <ContactDetails />
      <ItemsList />
      <TaxAndTotals />
    </div>
  );
};

export default InvoiceForm;
