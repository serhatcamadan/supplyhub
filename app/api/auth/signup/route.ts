import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

export async function POST(req: Request) {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const { name, email, password, companyName, companyType, role } = await req.json() as {
    name: string
    email: string
    password: string
    companyName: string
    companyType: 'seller' | 'buyer'
    role: 'admin' | 'staff'
  }

  // 1. Auth kullanıcısı oluştur (e-posta doğrulaması atlanır)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  })
  if (authError) return Response.json({ error: authError.message }, { status: 400 })

  const userId = authData.user.id

  // 2. Şirket oluştur
  const { data: company, error: companyError } = await supabaseAdmin
    .from('companies')
    .insert({ name: companyName, type: companyType })
    .select()
    .single()

  if (companyError) {
    await supabaseAdmin.auth.admin.deleteUser(userId)
    return Response.json({ error: companyError.message }, { status: 400 })
  }

  // 3. Kullanıcı profili oluştur
  const { error: profileError } = await supabaseAdmin
    .from('users')
    .insert({ id: userId, company_id: company.id, email, role, name })

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(userId)
    return Response.json({ error: profileError.message }, { status: 400 })
  }

  // 4. Proxy'nin DB sorgusu olmadan okuyabilmesi için metadata'ya kaydet
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { name, company_type: companyType, role, company_id: company.id },
  })

  // 5. Oturumu döndür (istemci session'ı set edecek)
  const { data: signIn, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  })
  if (signInError) return Response.json({ error: signInError.message }, { status: 400 })

  return Response.json({
    session: signIn.session,
    companyType,
  })
}
