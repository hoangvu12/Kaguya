import classNames from "classnames";
import React, { PropsWithChildren, useEffect } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
} from "react-icons/fi";
import {
  TableInstance,
  TableOptions,
  usePagination,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseSortByOptions,
  useTable,
} from "react-table";

export type TableInstanceWithHooks<T extends object> = TableInstance<T> &
  UsePaginationInstanceProps<T> & {
    state: UsePaginationState<T>;
  };

export type TableProps<T extends object = {}> = TableOptions<T> &
  UsePaginationOptions<T> &
  UseSortByOptions<T> & {
    initialState: {
      pageIndex: number;
      pageSize: number;
    };
  } & {
    onPageSizeChange?: (pageSize: number) => void;
    onPageIndexChange?: (pageIndex: number) => void;
  };

const Table = <T extends object = {}>({
  onPageSizeChange,
  onPageIndexChange,
  ...props
}: PropsWithChildren<TableProps<T>>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state: { pageIndex, pageSize },
    nextPage,
    previousPage,
    pageOptions,
    canPreviousPage,
    canNextPage,
    setPageSize,
    page,
  } = useTable(
    // @ts-ignore
    props,
    usePagination
  ) as TableInstanceWithHooks<T>;

  useEffect(() => {
    onPageSizeChange?.(pageSize);
  }, [onPageSizeChange, pageSize]);

  useEffect(() => {
    onPageIndexChange?.(pageIndex);
  }, [onPageIndexChange, pageIndex]);

  return (
    <div className="w-full overflow-x-scroll md:overflow-x-hidden space-y-8">
      <table
        className="w-full divide-y divide-background-800"
        {...getTableProps()}
      >
        <thead className="bg-background-800">
          {
            // Loop over the header rows
            headerGroups.map((headerGroup, index) => (
              // Apply the header row props
              <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column, columnIndex) => (
                    // Apply the header cell props
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                      key={columnIndex}
                    >
                      <div className="flex items-center space-x-2">
                        <p>
                          {
                            // Render the header
                            column.render("Header")
                          }
                        </p>
                      </div>
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}
        <tbody
          className="bg-background-900 divide-y divide-gray-700 overflow-x-scroll"
          {...getTableBodyProps()}
        >
          {
            // Loop over the table rows
            page.map((row, rowIndex) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                // Apply the row props
                <tr key={rowIndex} {...row.getRowProps()}>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell, cellIndex) => {
                      // Apply the cell props
                      return (
                        <td key={cellIndex} {...cell.getCellProps()}>
                          {
                            // Render the cell contents
                            cell.render("Cell")
                          }
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>

      <div className="ml-auto flex items-center gap-x-8 gap-y-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FiChevronLeft
              className={classNames(
                "w-6 h-6 cursor-pointer",
                !canPreviousPage && "text-gray-500"
              )}
              onClick={previousPage}
            />
            <FiChevronRight
              className={classNames(
                "w-6 h-6 cursor-pointer",
                !canNextPage && "text-gray-500"
              )}
              onClick={nextPage}
            />
          </div>

          <strong>
            {pageIndex + 1} / {pageOptions.length}
          </strong>
        </div>

        <div className="flex items-center space-x-2">
          <span className="shrink-0">Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal bg-background-900 bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-white focus:border-primary-500 focus:outline-none"
          >
            {[1, 5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option
                className="bg-background-900 p-2"
                key={pageSize}
                value={pageSize}
              >
                {pageSize} dòng
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Table);
