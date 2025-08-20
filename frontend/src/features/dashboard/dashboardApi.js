import { apiSlice } from "../../store/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: ({ baseId, type, start, end }) =>
        `/dashboard?baseId=${baseId || ""}&type=${type || ""}&start=${
          start || ""
        }&end=${end || ""}`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
