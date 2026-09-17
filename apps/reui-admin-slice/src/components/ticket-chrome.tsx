import {
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  Share2Icon,
  UserRoundIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/reui/badge"
import {
  getChannelConfig,
  getPriorityConfig,
  getStatusConfig,
  getTeamMember,
  type TicketChannel,
  type TicketPriority,
  type TicketStatus,
} from "@/data/tickets"

export function StatusBadge({ status }: { status: TicketStatus }) {
  const config = getStatusConfig(status)
  return (
    <Badge variant={config.badge} className="gap-1.5 whitespace-nowrap">
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  )
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const config = getPriorityConfig(priority)
  return (
    <Badge variant={config.badge} className="capitalize">
      {config.label}
    </Badge>
  )
}

const CHANNEL_ICON: Record<TicketChannel, typeof MailIcon> = {
  email: MailIcon,
  chat: MessageCircleIcon,
  phone: PhoneIcon,
  social: Share2Icon,
}

export function ChannelTag({ channel }: { channel: TicketChannel }) {
  const config = getChannelConfig(channel)
  const Icon = CHANNEL_ICON[channel]
  return (
    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
      <Icon className="size-3.5" />
      {config.label}
    </span>
  )
}

export function AssigneeAvatar({
  assignee,
  showName = false,
  size = "default",
}: {
  assignee: string | null
  showName?: boolean
  size?: "sm" | "default"
}) {
  const member = getTeamMember(assignee)
  const avatarSizeClass = size === "sm" ? "size-6" : "size-7"

  if (!member) {
    return (
      <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
        <Avatar className={avatarSizeClass}>
          <AvatarFallback className="bg-muted">
            <UserRoundIcon className="size-3.5 opacity-60" />
          </AvatarFallback>
        </Avatar>
        {showName && "Unassigned"}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <Avatar className={avatarSizeClass}>
        <AvatarFallback
          className={`${member.color} text-[10px] font-semibold text-white`}
        >
          {member.initials}
        </AvatarFallback>
      </Avatar>
      {showName && <span className="line-clamp-1">{member.label}</span>}
    </span>
  )
}
