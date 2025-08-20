import { apiSlice } from "../../store/apiSlice";

export const purchaseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPurchases: builder.query({
      query: ({ baseId, type, start, end }) =>
        `/purchases?baseId=${baseId || ""}&type=${type || ""}&start=${
          start || ""
        }&end=${end || ""}`,
      providesTags: ["Purchase"],
    }),
    createPurchase: builder.mutation({
      query: (body) => ({
        url: "/purchases",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Purchase", "Asset"],
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
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
  useGetBasesQuery,
  useGetAssetsQuery,
} = purchaseApi;
