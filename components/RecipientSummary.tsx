export function RecipientSummary({
  name,
  phone,
  address,
  landmark,
  pincode,
  city,
}: {
  name: string;
  phone: string;
  address: string;
  landmark?: string | null;
  pincode?: string | null;
  city: string;
}) {
  return (
    <div className="space-y-1 text-sm">
      <p className="font-medium text-ink">{name}</p>
      <p className="text-muted">{phone}</p>
      <p className="text-muted">
        {address}
        {landmark ? `, near ${landmark}` : ""}
        {pincode ? ` - ${pincode}` : ""}
      </p>
      <p className="text-muted">{city}</p>
    </div>
  );
}
