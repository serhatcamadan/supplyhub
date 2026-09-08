import { redirect } from 'next/navigation'

export default async function SellerProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  redirect(`/${locale}/seller/products/${id}/edit`)
}
