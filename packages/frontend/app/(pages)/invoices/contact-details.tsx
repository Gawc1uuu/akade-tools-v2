import React from 'react';

import { useInvoice } from '@/app/context/invoice-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ContactDetails = () => {
  const { invoice, updateInvoice } = useInvoice();

  return (
    <Card>
      <CardHeader>
        <CardTitle>From and To</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3>From (your details)</h3>
          <div>
            <Label htmlFor="fromName">Name</Label>
            <Input
              id="fromName"
              placeholder="Your name or company"
              value={invoice.fromName}
              onChange={(e) => updateInvoice({ fromName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="fromEmail">Email</Label>
            <Input
              id="fromEmail"
              placeholder="your@email.com"
              type="email"
              value={invoice.fromEmail}
              onChange={(e) => updateInvoice({ fromEmail: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3>To (client details)</h3>
          <div>
            <Label htmlFor="toName">Name</Label>
            <Input
              id="toName"
              placeholder="Client name or company"
              value={invoice.toName}
              onChange={(e) => updateInvoice({ toName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="toEmail">Email</Label>
            <Input
              id="toEmail"
              placeholder="client@email.com"
              type="email"
              value={invoice.toEmail}
              onChange={(e) => updateInvoice({ toEmail: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactDetails;
