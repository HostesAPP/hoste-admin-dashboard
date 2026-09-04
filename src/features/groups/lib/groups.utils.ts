import { ENGAGEMENTS } from "@/features/engagements";
import { GROUP_MEMBERS, GROUPS } from "@/features/groups";
import { PROFILES } from "@/features/profiles";


// helper function to get group members
export const getGroupMembers = (groupId: string) => {
  return GROUP_MEMBERS?.filter((member) => member.groupId === groupId)
}

// get group engagements
export const getGroupEngagements = (groupId: string) => {
  return ENGAGEMENTS?.filter((engagement) => engagement.groupId === groupId)
}

// get group leader
export const getGroupLeader = (groupLeaderId: string) => {
  return PROFILES.find((profile) => profile.userId === groupLeaderId)
}

// get current group
export const getCurrentGroup = (groupId: string) => {
  return GROUPS.find(group => group.id === groupId)
}