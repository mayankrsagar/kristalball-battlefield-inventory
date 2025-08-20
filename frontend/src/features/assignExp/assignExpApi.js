import { apiSlice } from "../../store/apiSlice";

export const assignExpApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query({
      query: ({ baseId, start, end }) =>
        `/assignments?baseId=${baseId || ""}&start=${start || ""}&end=${
          end || ""
        }`,
      providesTags: ["Assignment"],
    }),
    createAssignment: builder.mutation({
      query: (body) => ({ url: "/assignments", method: "POST", body }),
      invalidatesTags: ["Assignment", "Asset"],
    }),
    getExpenditures: builder.query({
      query: ({ baseId, start, end }) =>
        `/expenditures?baseId=${baseId || ""}&start=${start || ""}&end=${
          end || ""
        }`,
      providesTags: ["Expenditure"],
    }),
    createExpenditure: builder.mutation({
      query: (body) => ({ url: "/expenditures", method: "POST", body }),
      invalidatesTags: ["Expenditure", "Asset"],
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
  useGetAssignmentsQuery,
  useCreateAssignmentMutation,
  useGetExpendituresQuery,
  useCreateExpenditureMutation,
  useGetBasesQuery,
  useGetAssetsQuery,
} = assignExpApi;
