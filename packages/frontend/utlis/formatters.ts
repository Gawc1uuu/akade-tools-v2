export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number) => {
  return `${amount.toFixed(2)}`;
};
