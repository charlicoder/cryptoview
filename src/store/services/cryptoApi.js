import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3'

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: COINGECKO_API_BASE,
  }),
  tagTypes: ['Crypto', 'Global'],
  endpoints: (builder) => ({
    // 🔹 Get list of cryptocurrencies
    getCryptocurrencies: builder.query({
      query: ({ page = 1, search = '', sortBy = 'market_cap_desc' }) => {
        if (search) {
          // If searching, use the search endpoint
          return `search?query=${search}`
        }
        return `coins/markets?vs_currency=usd&order=${sortBy}&per_page=100&page=${page}&sparkline=false`
      },
      transformResponse: (response, meta, arg) => {
        if (arg.search) {
          // If search, take first 20 coins and fetch markets
          const coinIds = response.coins?.slice(0, 20).map((coin) => coin.id).join(',')
          return fetch(
            `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false`
          ).then((res) => res.json())
        }
        return response
      },
      providesTags: ['Crypto'],
    }),

    // 🔹 Get global stats
    getGlobalStats: builder.query({
      query: () => `global`,
      providesTags: ['Global'],
    }),

    // 🔹 Get coin chart
    getCoinChart: builder.query({
      query: ({ coinId, days }) => `coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
    }),

    // 🔹 Get coin details
    getCoinDetails: builder.query({
      query: (coinId) =>
        `coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`,
    }),
  }),
})

export const {
  useGetCryptocurrenciesQuery,
  useGetGlobalStatsQuery,
  useGetCoinChartQuery,
  useGetCoinDetailsQuery,
} = cryptoApi
