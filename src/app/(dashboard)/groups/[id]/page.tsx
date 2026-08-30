"use client";

import { useParams } from "next/navigation";

export default function GroupDetailPage() {

    const params = useParams()
    const groupId = params?.id

    return (
        <div>
            <h1>Group Detail {groupId}</h1>
        </div>
  )
}