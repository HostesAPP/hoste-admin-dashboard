"use client";

import { useParams } from "next/navigation";

export default function GroupMembersPage() {


  const params = useParams()
  const groupId = params?.id

  return (
    <div>
      <h1>Group Members for {groupId}</h1>
    </div>
  );
}