'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAdminOrgs, useInviteOrgAdmin } from '@/lib/queries/super-admin.queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  org_id: z.string().min(1, 'Organization is required'),
})

type FormData = z.infer<typeof schema>

export default function SuperAdminInvitePage() {
  const { data: orgsData } = useAdminOrgs({ page: 1, page_size: 100 })
  const orgs = orgsData?.data ?? []
  const inviteAdmin = useInviteOrgAdmin()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const result = await inviteAdmin.mutateAsync(data)
      toast.success(`Invited ${result.name} as org admin`)
      reset()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } }
      toast.error(e?.response?.data?.error?.message ?? 'Failed to invite admin')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Invite Org Admin" description="Create an admin user for an existing organization" />
      <Card className="max-w-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Jane Doe" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="jane@company.com" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="org_id">Organization</Label>
              <select
                id="org_id"
                {...register('org_id')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Select an organization…</option>
                {orgs.map((org) => (
                  <option key={org.id} value={org.id}>{org.name} ({org.slug})</option>
                ))}
              </select>
              {errors.org_id && <p className="text-xs text-destructive">{errors.org_id.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Inviting…' : 'Invite Admin'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
