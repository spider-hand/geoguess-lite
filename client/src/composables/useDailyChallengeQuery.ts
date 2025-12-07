import { DailyChallengesApi } from '@/services'
import useApi from './useApi'
import { useQuery } from '@tanstack/vue-query'

const useDailyChallengeQuery = () => {
  const { apiConfig } = useApi()
  const dailyChallengesApi = new DailyChallengesApi(apiConfig)

  const {
    data: todayChallenge,
    isPending: isPendingOnFetchTodayChallenge,
    isSuccess: isSuccessOnFetchTodayChallenge,
    isError: isErrorOnFetchTodayChallenge,
  } = useQuery({
    queryKey: ['dailyChallenge', 'today'],
    queryFn: async () => {
      const resp = await dailyChallengesApi.getTodayChallenge()
      return resp
    },
    staleTime: Infinity,
  })

  return {
    todayChallenge,
    isPendingOnFetchTodayChallenge,
    isSuccessOnFetchTodayChallenge,
    isErrorOnFetchTodayChallenge,
  }
}

export default useDailyChallengeQuery
