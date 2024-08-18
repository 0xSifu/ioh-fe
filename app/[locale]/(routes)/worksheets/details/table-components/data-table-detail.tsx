"use client";

import React, { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { ClaimdetailsDataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/store";
import { useTotalClaim } from "@/hooks/useTotalClaim";
import { useTotalCover } from "@/hooks/useTotalCover";
import { useTotalExcess } from "@/hooks/useTotalExcess";
import { postDetailClaim } from "@/lib/post-detail-claim";
import { postDraftClaim } from "@/lib/post-draft-claim";
import Spinner from "@/components/Spinner";

type Props = {
  data: any;
  currency: string;
  rateValue: number;
  email: string;
  token: string;
};

const DataTableDetail = ({ data, currency, rateValue, email, token }: Props) => {
  const { datatable, setTableDataDefault, updateCell } = useAppStore((state) => ({
    datatable: state.datatable,
    setTableDataDefault: state.setTableDataDefault,
    updateCell: state.updateCell,
  }));

  const [tableData, setTableData] = useState<any[]>(data.claimData);
  const [claimdata, setClaimData] = useState(data.claimData || "");
  const [user, setUser] = useState(data.user || "");
  const [claimNo, setClaimNo] = useState(data.user?.claimNo || "");
  const [memberName, setMemberName] = useState(data.user?.memberName || "");
  const [polisNumber, setPolisNumber] = useState(data.user?.polisNumber || "");
  const [admisionDate, setAdmisionDate] = useState(data.user?.admisionDate || "");
  const [dischargeDate, setDischargeDate] = useState(data.user?.dischargeDate || "");
  const [deductiblePlan, setDeductiblePlan] = useState(data.user?.deductiblePlan || "");
  const [currencyRateDeductible, setCurrencyRateDeductible] = useState(data.user?.currencyRateDeductible || "");
  const [coShare, setCoShare] = useState(data.user?.coShare || "");
  const [hakKamarIDR, setHakKamarIDR] = useState(data.user?.hakKamarIDR || "");
  const [hakKamarCurrency, setHakKamarCurrency] = useState(data.user?.hakKamarCurrency || "");
  const [kamarDitempatiIDR, setKamarDitempatiIDR] = useState(data.user?.kamarDitempatiIDR || "");
  const [kamarDitempatiCurrency, setKamarDitempatiCurrency] = useState(data.user?.kamarDitempatiCurrency || "");
  const [totalclaim, setTotalClaim] = useState(data.user?.totalClaim || "");
  const [totalPaid, setTotalPaid] = useState(data.user?.totalPaid || "");
  const [totalExcess, setTotalExcess] = useState(data.user?.totalExcess || "");
  const [parsedValue, setParsedValue] = useState(rateValue);
  const [totalExcessColumn, setTotalExcessColumn] = useState(0);
  const [totalCover, setTotalCover] = useState(0);
  const [totalClaimColumn, setTotalClaimColumn] = useState(0);
  const [deductibleValue, setDeductibleValue] = useState(0);
  const totalClaim = useTotalClaim();
  const totalClaimValue = useTotalClaim();
  const excessColumnValue = useTotalExcess();
  const coverValue = useTotalCover();
  const [loading, setLoading] = useState(false);

  const formatNumberWithSeparator = (value: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat("en-US", { ...options, minimumFractionDigits: 2 }).format(value);
  };

  useEffect(() => {
    setTableDataDefault(data.claimData);
    setUser(data.user);
    setTableData(data.claimData || []);
  }, [data]);

  useEffect(() => {
    const deductibleValue = parseFloat(deductiblePlan) || 0;
    const hakkamarValue = parseFloat(hakKamarCurrency) || 0;
    const kamarditempatiValue = parseFloat(kamarDitempatiCurrency) || 0;

    const hakKamarIDRValue = (hakkamarValue * parsedValue).toFixed(2);
    const kamarDitempatiIDRValue = (kamarditempatiValue * parsedValue).toFixed(2);

    setHakKamarIDR(hakKamarIDRValue);
    setKamarDitempatiIDR(kamarDitempatiIDRValue);
    setDeductibleValue(deductibleValue);
    setCurrencyRateDeductible((deductibleValue * parsedValue).toFixed(2));

    const updatedData = data.claimData.map((row: any) => {
      const hakKamar = parseFloat(hakKamarIDRValue);
      const kamarDitempati = parseFloat(kamarDitempatiIDRValue);
      const prorataValue = ((hakKamar / kamarDitempati) * 100) + "%";

      return {
        ...row,
        prorate: prorataValue,
      };
    });

    setTableData(updatedData);
  }, [deductiblePlan, hakKamarCurrency, kamarDitempatiCurrency, parsedValue, data.claimData]);

  useEffect(() => {
    setTotalExcessColumn(excessColumnValue);
    setTotalCover(coverValue);
    const calculatedTotalExcess = calculateTotalExcess(excessColumnValue, coverValue);
    setTotalExcess(calculatedTotalExcess);
    setTotalPaid(calculateTotalClaim(calculatedTotalExcess));
  }, [excessColumnValue, coverValue, currencyRateDeductible, coShare]);

  useEffect(() => {
    setTotalPaid(calculateTotalClaim(totalExcess));
  }, [totalExcess, totalClaim]);

  const calculateTotalExcess = (excessColumnValue: number, coverValue: number) => {
    const currencyRateDeductibleValue = parseFloat(currencyRateDeductible) || 0;
    const coShareValue = parseFloat(coShare) || 0;
    return excessColumnValue + currencyRateDeductibleValue + (coShareValue * coverValue) / 100;
  };

  const calculateTotalClaim = (totalExcess: number) => {
    const totalClaimValue = totalClaim || 0;
    return totalClaimValue - totalExcess;
  };

  const columns = getColumns({
    data: tableData,
    currency,
    rateValue,
    updateData: (rowIndex: number, columnId: string, value: any) => {
      updateCell(rowIndex, columnId, value);
    },
    user,
    datatable,
  });

  
  const handleSubmit = async () => {
    setLoading(true);
    const transformedData = datatable.map((item, index) => {
      const tableDataItem = tableData[index]; 
  
      return {
        benefitId: item.idBenefit,
        insuranceCode: item.insuranceCode,
        qty: item.qty,
        rate: item.rate,
        prorate: Number(parseFloat(tableDataItem.prorate).toFixed(4)) || 0,
        kursFrom: currency.toUpperCase(),
        kursTo: "IDR",
        exclusionAmountFrom: item.exclusionAmountFrom || 0,
        exclusionAmountTo: item.exclusionAmountTo || 0,
        claimAmount: item.claimAmount || 0,
        coverAmount: item.coverAmount || 0,
        excessAmount: item.excessAmount || 0,
        deductableFrom: deductibleValue || 0,
        deductableTo: Number(parseFloat(currencyRateDeductible)) || 0,
        coShareFrom: Number(parseFloat(coShare)),
        coShareTo: Number(parseFloat(coShare)) * rateValue,
        remark: item.remark,
      };
    });
  
    const postData = {
      email: email,
      status: "SUBMIT",
      transClaimId: data.user.id,
      token: token,
      benefit: transformedData,
    };

    console.log("Data submitted successfully:", JSON.stringify(postData));
    
  
    try {
      const result = await postDetailClaim(postData);
      console.log("Data submitted successfully:", JSON.stringify(postData));
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDraft = async () => {
    setLoading(true);
    const transformedData = datatable.map((item, index) => {
      const tableDataItem = tableData[index]; 
  
      return {
        benefitId: item.idBenefit,
        insuranceCode: item.insuranceCode,
        qty: item.qty,
        rate: item.rate,
        prorate: Number(parseFloat(tableDataItem.prorate).toFixed(4)) || 0,
        kursFrom: currency.toUpperCase(),
        kursTo: "IDR",
        exclusionAmountFrom: item.exclusionAmountFrom || 0,
        exclusionAmountTo: item.exclusionAmountTo || 0,
        claimAmount: item.claimAmount || 0,
        coverAmount: item.coverAmount || 0,
        excessAmount: item.excessAmount || 0,
        deductableFrom: deductibleValue || 0,
        deductableTo: Number(parseFloat(currencyRateDeductible)) || 0,
        coShareFrom: Number(parseFloat(coShare)),
        coShareTo: Number(parseFloat(coShare)) * rateValue,
        remark: item.remark,
      };
    });
  
    const postData = {
      email: email,
      status: "SUBMIT",
      transClaimId: data.user.id,
      token: token,
      benefit: transformedData,
    };

    console.log("Data submitted successfully:", JSON.stringify(postData));
  
    try {
      const result = await postDraftClaim(postData);
      console.log("Data submitted successfully:", JSON.stringify(postData));
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Claim ID</label>
          <Input
            className="col-span-2"
            placeholder="Enter claim ID..."
            value={claimNo}
            onChange={(e) => setClaimNo(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Nama Peserta</label>
          <Input
            className="col-span-2"
            placeholder="Enter participant name..."
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">No Polis</label>
          <Input
            className="col-span-2"
            placeholder="Enter policy number..."
            value={polisNumber}
            onChange={(e) => setPolisNumber(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Admision Date</label>
          <Input
            className="col-span-2"
            placeholder="Enter admission date..."
            value={admisionDate}
            onChange={(e) => setAdmisionDate(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Discharge Date</label>
          <Input
            className="col-span-2"
            placeholder="Enter discharge date..."
            value={dischargeDate}
            onChange={(e) => setDischargeDate(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Kurs Rate</label>
          <Input
            className="col-span-2"
            placeholder="Enter exchange rate..."
            value={formatNumberWithSeparator(parsedValue)}
            readOnly
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Deductible Plan [{currency.toUpperCase()}]</label>
          <Input
            className="col-span-2"
            placeholder="Enter deductible plan..."
            value={deductiblePlan}
            onChange={(e) => setDeductiblePlan(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Deductible [IDR]</label>
          <Input
            className="col-span-2"
            placeholder="Enter currency rate deductible..."
            value={formatNumberWithSeparator(currencyRateDeductible)}
            readOnly
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Co-share (%)</label>
          <Input
            className="col-span-2"
            placeholder="Enter co-share..."
            value={coShare}
            onChange={(e) => setCoShare(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Hak Kamar [{currency.toUpperCase()}]</label>
          <Input
            className="col-span-2"
            value={hakKamarCurrency}
            onChange={(e) => setHakKamarCurrency(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Hak Kamar [IDR]</label>
          <Input
            className="col-span-2"
            value={formatNumberWithSeparator(hakKamarIDR)}
            onChange={(e) => setHakKamarIDR(e.target.value)}
            readOnly
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Kamar ditempati [{currency.toUpperCase()}]</label>
          <Input
            className="col-span-2"
            value={kamarDitempatiCurrency}
            onChange={(e) => setKamarDitempatiCurrency(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Kamar ditempati [IDR]</label>
          <Input
            className="col-span-2"
            value={formatNumberWithSeparator(kamarDitempatiIDR)}
            onChange={(e) => setKamarDitempatiIDR(e.target.value)}
            readOnly
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Total Claim</label>
          <Input
            className="col-span-2"
            value={formatNumberWithSeparator(totalClaim)}
            onChange={(e) => setTotalClaim(e.target.value)}
            readOnly
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Total Excess</label>
          <Input
            className="col-span-2"
            value={formatNumberWithSeparator(totalExcess)}
            onChange={(e) => setTotalExcess(e.target.value)}
            readOnly
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">Total Cover</label>
          <Input
            className="col-span-2"
            value={formatNumberWithSeparator(totalPaid)}
            onChange={(e) => setTotalPaid(e.target.value)}
            readOnly
          />
        </div>
      </div>
      <div className="col-span-2">
        <ClaimdetailsDataTable user={user} data={claimdata} columns={columns} setData={setClaimData} />
      </div>
      <div className="mt-4 flex justify-end space-x-4">
        <button
          onClick={handleDraft}
          className="w-1/2 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
        >
          Save as Draft
        </button>
        <button
          onClick={handleSubmit}
          className="w-1/2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default DataTableDetail;