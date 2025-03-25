type QueryConfig = {
  searchTerm: string;
  isAssignedToMe?: boolean;
  isTeamMember?: boolean;
  isValid?: boolean;
  assignedRoles?: Role[];
}

type PageableProps = {
  page: number;
  size: number;
};

export type PageableResponse<T> = {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  number: number;
  size: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
};
