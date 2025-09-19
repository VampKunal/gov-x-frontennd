"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react"

const statusConfig = {
  "Pending": {
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: Clock,
    label: "Pending"
  },
  "In Progress": {
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: AlertCircle,
    label: "In Progress"
  },
  "Under Review": {
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: AlertCircle,
    label: "Under Review"
  },
  "Resolved": {
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: CheckCircle,
    label: "Resolved"
  },
  "Rejected": {
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: XCircle,
    label: "Rejected"
  },
  "Closed": {
    color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    icon: XCircle,
    label: "Closed"
  }
}

export function StatusBadge({ status, showIcon = true, size = "default" }) {
  const config = statusConfig[status] || statusConfig["Pending"]
  const Icon = config.icon

  return (
    <Badge 
      variant="outline" 
      className={`${config.color} ${size === "sm" ? "text-xs px-2 py-0.5" : ""}`}
    >
      {showIcon && <Icon className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} mr-1`} />}
      {config.label}
    </Badge>
  )
}