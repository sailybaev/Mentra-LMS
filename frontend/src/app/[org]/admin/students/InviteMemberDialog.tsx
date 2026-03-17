'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'
import { useInviteMember } from '@/lib/queries/members.queries'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MemberRole } from '@/types/member'

export function InviteMemberDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<MemberRole>('student')
  const invite = useInviteMember()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await invite.mutateAsync({ name, email, password, role })
      toast.success('Member invited successfully')
      setOpen(false)
      setName('')
      setEmail('')
      setPassword('')
      setRole('student')
    } catch (err) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message
      toast.error(msg ?? 'Failed to invite member')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#059669] hover:bg-[#047857] text-white gap-1.5">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-wide">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-[#e4e2de] focus-visible:ring-[#059669] focus-visible:ring-1"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-wide">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#e4e2de] focus-visible:ring-[#059669] focus-visible:ring-1"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-wide">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border-[#e4e2de] focus-visible:ring-[#059669] focus-visible:ring-1"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-wide">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as MemberRole)}>
              <SelectTrigger className="border-[#e4e2de]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={invite.isPending}
            className="w-full bg-[#059669] hover:bg-[#047857] text-white"
          >
            {invite.isPending ? 'Inviting…' : 'Invite'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
