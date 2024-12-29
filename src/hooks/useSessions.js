import { useQuery } from "@tanstack/react-query"
import { getSessions } from "../lib/api"

export const SESSIONS = "sessions"

const useSessions = (options = {}) => {
  const {data: sessions = [], ...rest} = useQuery({
    queryKey: [SESSIONS],
    queryFn: getSessions,
    ...options
  })

  return {sessions, ...rest}
}

export default useSessions