import React, { useState } from "react";
import H2Title from "@/components/typography/h2";
import { WorksheetsDataTable } from "../../worksheets/table-components/data-table";
import { getColumns } from "../../worksheets/details/table-components/columns";

type Props = {
  user: any,
  data: {
    claimData: any[];
  };
  currency: string;
  rateValue: number;
  datatable: any;
};

const DetailWorksheetsView = ({ user, data, currency, rateValue, datatable }: Props) => {
  const [tableData, setTableData] = useState<any[]>(data.claimData);

  const updateData = (rowIndex: number, columnId: string, value: any) => {
    setTableData(old => 
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const columns = getColumns({
    user,
    data: tableData,
    currency,
    rateValue,
    updateData,
    datatable
  });

  return (
    <div className="pt-2 space-y-3">
      {data && (
        <WorksheetsDataTable
          initialData={tableData}
          columns={columns}
        />
      )}
    </div>
  );
};

export default DetailWorksheetsView;
