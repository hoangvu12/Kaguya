import { PropsWithChildren } from "react";
import Table, { TableProps } from "./Table";

interface ServerPaginateTableProps<T extends object = {}>
  extends Partial<TableProps<T>> {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

const ServerPaginateTable = <T extends object = {}>({
  pageIndex = 0,
  pageSize,
  totalCount,
  ...props
}: PropsWithChildren<ServerPaginateTableProps<T>>) => {
  return (
    // @ts-ignore
    <Table
      initialState={{ pageIndex, pageSize }}
      manualPagination
      pageCount={Math.round(totalCount / pageSize)}
      {...props}
    />
  );
};

export default ServerPaginateTable;
