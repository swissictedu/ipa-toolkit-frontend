import { PaginationProps } from 'antd';
import { useSearchParams } from 'react-router-dom';
import CONFIGURATION from '../configuration';

type PaginationOptions = {
  pageSize?: number;
  searchParamKey?: string;
  customPaginationProps?: Partial<PaginationProps>;
};

export const usePagination = (totalCount?: number, options?: PaginationOptions): { paginationConfig: PaginationProps; currentPage?: number } => {
  const { pageSize = CONFIGURATION.defaultValues.pageSize, searchParamKey = 'page', customPaginationProps } = options ?? {};

  const [searchParams, setSearchParams] = useSearchParams();

  const pageParams = searchParams.get(searchParamKey);
  const currentPage = pageParams ? parseInt(pageParams) : undefined;

  const updatePageParam = (page: number) => {
    searchParams.set(searchParamKey, `${page}`);
    setSearchParams(searchParams);
  };

  return {
    paginationConfig: {
      current: currentPage,
      onChange: updatePageParam,
      pageSize,
      total: totalCount,
      showSizeChanger: false,
      ...customPaginationProps
    },
    currentPage
  };
};
