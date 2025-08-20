import { apiSlice } from "../../store/apiSlice";

export const transferApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransfers: builder.query({
      query: ({ baseId, start, end }) =>
        `/transfers?baseId=${baseId || ""}&start=${start || ""}&end=${
          end || ""
        }`,
      providesTags: ["Transfer"],
    }),
    createTransfer: builder.mutation({
      query: (body) => ({
        url: "/transfers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Transfer", "Asset"],
    }),
    getBases: builder.query({
      query: () => "/bases",
      providesTags: ["Base"],
    }),
    getAssets: builder.query({
      query: () => "/assets",
      providesTags: ["Asset"],
    }),
  }),
});

export const {
  useGetTransfersQuery,
  useCreateTransferMutation,
  useGetBasesQuery,
  useGetAssetsQuery,
} = transferApi;
