import { DailyScoresApi, type CreateDailyScoreRequest } from '@/services'
import useApi from './useApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

const useDailyScoreQuery = () => {
  const { apiConfig } = useApi()
  const dailyScoresApi = new DailyScoresApi(apiConfig)
  const queryClient = useQueryClient()

  const {
    data: todayTopScores,
    isPending: isPendingOnFetchTodayTopScores,
    isSuccess: isSuccessOnFetchTodayTopScores,
    isError: isErrorOnFetchTodayTopScores,
  } = useQuery({
    queryKey: ['dailyScores', 'today'],
    queryFn: async () => {
      const resp = await dailyScoresApi.getTodayTopScores()
      return resp
    },
  })

  const {
    mutate: mutateDailyScoreCreate,
    mutateAsync: mutateDailyScoreCreateAsync,
    isSuccess: isSuccessOnCreateDailyScore,
    isError: isErrorOnCreateDailyScore,
    isPending: isPendingOnCreateDailyScore,
  } = useMutation({
    mutationFn: async (params: CreateDailyScoreRequest) => {
      const resp = await dailyScoresApi.createDailyScore({
        createDailyScoreRequest: params,
      })
      return resp
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyScores', 'today'] })
    },
    onError: (error) => {
      console.error('Error creating daily score:', error)
    },
  })

  return {
    todayTopScores,
    isPendingOnFetchTodayTopScores,
    isSuccessOnFetchTodayTopScores,
    isErrorOnFetchTodayTopScores,
    mutateDailyScoreCreate,
    mutateDailyScoreCreateAsync,
    isSuccessOnCreateDailyScore,
    isErrorOnCreateDailyScore,
    isPendingOnCreateDailyScore,
  }
}

export default useDailyScoreQuery
