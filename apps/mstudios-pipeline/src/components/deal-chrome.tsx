import {
  ScissorsIcon,
  SparklesIcon,
  StoreIcon,
  TreesIcon,
  UserRoundIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/reui/badge"
import {
  getFitConfig,
  getStageConfig,
  getTeamMember,
  getVerticalConfig,
  type DealFit,
  type DealStage,
  type DealVertical,
} from "@/data/deals"

export function StageBadge({ stage }: { stage: DealStage }) {
  const config = getStageConfig(stage)
  return (
    <Badge variant={config.badge} className="gap-1.5 whitespace-nowrap">
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  )
}

export function FitBadge({ fit }: { fit: DealFit }) {
  const config = getFitConfig(fit)
  return <Badge variant={config.badge}>{config.label}</Badge>
}

const VERTICAL_ICON: Record<DealVertical, typeof StoreIcon> = {
  barber: ScissorsIcon,
  lawn: TreesIcon,
  cleaning: SparklesIcon,
  other: StoreIcon,
}

export function VerticalTag({ vertical }: { vertical: DealVertical }) {
  const config = getVerticalConfig(vertical)
  const Icon = VERTICAL_ICON[vertical]
  return (
    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
      <Icon className="size-3.5" />
      {config.label}
    </span>
  )
}

export function OwnerAvatar({
  owner,
  showName = false,
  size = "default",
}: {
  owner: string | null
  showName?: boolean
  size?: "sm" | "default"
}) {
  const member = getTeamMember(owner)
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
