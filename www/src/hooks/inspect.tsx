import useSWRMutation from 'swr/mutation'

async function hasCity(url: string, { arg }: { arg: string }) {
  const res = await fetch(`${url}/{"method": "hasCity", "address": "${arg}"}`)
  return res.json()
}

export const fetchHasCity = () => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    process.env.NEXT_PUBLIC_INSPECT_URL!,
    hasCity
  )
  return {
    trigger,     // Call with key like: trigger('abc123')
    data,
    error,
    isLoading: isMutating
  }
}
