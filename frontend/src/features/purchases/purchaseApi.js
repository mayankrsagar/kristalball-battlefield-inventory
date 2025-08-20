import { apiSlice } from "../../store/apiSlice";

export const purchaseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPurchases: builder.query({
      query: ({ baseId, start, end }) =>
        `/purchases?baseId=${baseId}&start=${start}&end=${end}`,
      providesTags: ["Purchase"],
    }),
    createPurchase: builder.mutation({
      query: (body) => ({ url: "/purchases", method: "POST", body }),
      invalidatesTags: ["Purchase", "Asset"],
    }),
  }),
});

export const { useGetPurchasesQuery, useCreatePurchaseMutation } = purchaseApi;
