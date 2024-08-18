"use client";

import React, { useState, useEffect } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { useAppStore } from '@/store/store';
import useDebounce from '@/hooks/useDebounce';

interface ColumnParams {
    user: any;
    data: any;
    currency: string;
    rateValue: number;
    updateData: (rowIndex: number, columnId: string, value: any) => void;
    datatable: any[];
}

const formatNumberWithSeparator = (value: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat('en-US', { ...options, minimumFractionDigits: 2 }).format(value);
};

export const getColumns = ({ user, data, currency, rateValue, updateData, datatable }: ColumnParams): ColumnDef<any>[] => {   
    return [
        {
            accessorKey: "itemName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="SUB BENEFIT NAME" />
            ),
            cell: ({ row }) => (
                <div className="w-[500px]">
                    {row.getValue("itemName")}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "innerLimitAmount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Inner Limit [IDR]" />
            ),
            cell: ({ row }) => (
                <div className="w-[200px]">
                    {formatNumberWithSeparator(row.getValue("innerLimitAmount"))}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "qty",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="QTY" />
            ),
            cell: ({ row }) => {
                const { datatable, updateCell } = useAppStore();
                const rowIndex = row.index;
                const initialData = datatable[rowIndex] || { qty: 0 };

                const [qty, setQty] = useState<number>(initialData.qty ?? 0);
                const debouncedQty = useDebounce(qty.toString(), 300);

                useEffect(() => {
                    const initialQtyString = initialData.qty !== null ? initialData.qty.toString() : '0';
                    if (debouncedQty !== initialQtyString) {
                        const exclusion = datatable[rowIndex]?.exclusionAmountFrom || 0;
                        const exclusionIDR = datatable[rowIndex]?.exclusionAmountTo || 0;
                        updateCell(rowIndex, 'qty', Number(debouncedQty));
                        updateCell(rowIndex, 'exclusionAmountTo', exclusionIDR);
                        updateCell(rowIndex, 'exclusionAmountFrom', exclusion);
                    }
                }, [debouncedQty, rowIndex, initialData.qty, updateCell]);

                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = Number(e.target.value);
                    if (!isNaN(newValue)) {
                        setQty(newValue);
                    }
                };

                return (
                    <div className="w-[150px]">
                        <input
                            type="text"
                            value={qty}
                            onChange={handleChange}
                            className="w-full border rounded p-1"
                        />
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "satuan",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={`SATUAN [${currency.toUpperCase()}]`} />
            ),
            cell: ({ row }) => {
                const { datatable, updateCell } = useAppStore();
                const rowIndex = row.index;
                const initialData = datatable[rowIndex] || { satuan: "", satuanIDR: 0 };

                const [satuan, setSatuan] = useState<string>(initialData.satuan);
                const debouncedSatuan = useDebounce(satuan, 300);

                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    setSatuan(e.target.value);
                };

                useEffect(() => {
                    const updatedSatuanIDR = parseFloat(debouncedSatuan) * rateValue;

                    if (debouncedSatuan !== initialData.satuan) {
                        updateCell(rowIndex, 'satuan', debouncedSatuan);
                        updateCell(rowIndex, 'satuanIDR', updatedSatuanIDR);

                        if (datatable[rowIndex]?.qty !== undefined) {
                            const claimAmount = datatable[rowIndex].qty * updatedSatuanIDR;
                            updateCell(rowIndex, 'claimAmount', claimAmount);
                        }
                    }
                }, [debouncedSatuan, rowIndex, rateValue, updateCell]);

                return (
                    <div className="w-[200px]">
                        <input
                            type="text"
                            value={satuan}
                            onChange={handleChange}
                            className="w-full border rounded p-1"
                        />
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "satuanIDR",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="SATUAN [IDR]" />
            ),
            cell: ({ row }) => {
                const { datatable } = useAppStore();
                const rowIndex = row.index;
                const satuanIDRValue = datatable[rowIndex]?.satuanIDR !== undefined
                    ? formatNumberWithSeparator(datatable[rowIndex].satuanIDR)
                    : "0.00";
                return <div className="w-[200px]">{satuanIDRValue}</div>;
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "totalClaim",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="TOTAL CLAIM [IDR]" />
            ),
            cell: ({ row }) => {
                const { datatable } = useAppStore();
                const rowIndex = row.index;
                const totalClaimDefault = datatable[rowIndex]?.claimAmount !== undefined
                    ? formatNumberWithSeparator(datatable[rowIndex].claimAmount)
                    : 0

                return <div className="w-[200px]">
                    {totalClaimDefault}
                </div>;
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "prorata",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="PRORATA" />
            ),
            cell: ({ row }) => {
                const rowIndex = row.index;
                const prorataValue = data[rowIndex]?.prorate;
                const numericProrata = parseFloat(prorataValue);
                const displayValue = isNaN(numericProrata) ? '0.00%' : numericProrata.toFixed(2) + '%';
                return (
                    <div className="w-[200px]">
                        {displayValue}
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "exclusion",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={`EXCLUSION [${currency.toUpperCase()}]`} />
            ),
            cell: ({ row }) => {
                const { datatable, updateCell } = useAppStore();
                const rowIndex = row.index;
                const initialData = datatable[rowIndex] || {
                    exclusionAmountFrom: 0,
                    exclusionAmountTo: 0,
                    innerLimitQty: 0,
                    qty: 0,
                    satuan: "",
                    satuanIDR: 0,
                    claimAmount: 0,
                    prorata: 0,
                    coverAmount: 0,
                    excessAmount: 0
                };

                const [rowState, setRowState] = useState(initialData);

                const debouncedExclusion = useDebounce(rowState.exclusionAmountFrom?.toString() || "0", 300);

                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    let prorata;
                    const newValue = e.target.value;
                    const totalExclusion = Number(newValue) * rateValue;
                    const initiateProrata = data[rowIndex].prorate;
                    
                    if (initiateProrata) {
                        prorata = parseFloat(initiateProrata.replace('%', '')) / 100;
                        console.log("PRO: ",initiateProrata);
                        console.log("PRORATA : ",prorata);
                    } else {
                        prorata = parseFloat(initiateProrata.replace('%', '')) / 100;
                    }
                    const helper = datatable[rowIndex].claimAmount * Number(prorata) - totalExclusion;
                    const innerLimitAmount = data[rowIndex].innerLimitAmount;

                    const cover = helper >= innerLimitAmount ? innerLimitAmount : helper;
                    console.log("COVER : ",cover);
                    
                    const excessIDR = datatable[rowIndex].claimAmount - cover;

                    setRowState(prevState => ({
                        ...prevState,
                        exclusionAmountFrom: Number(newValue),
                        exclusionAmountTo: totalExclusion,
                        coverAmount: cover,
                        excessAmount: excessIDR
                    }));

                    // Immediately update the datatable in the store
                    updateCell(rowIndex, 'exclusionAmountFrom', Number(newValue));
                    updateCell(rowIndex, 'exclusionAmountTo', totalExclusion);
                    updateCell(rowIndex, 'coverAmount', cover);
                    updateCell(rowIndex, 'excessAmount', excessIDR);
                };

                useEffect(() => {
                    // Only run the effect if the debounced value changes
                    if (rowState.exclusion !== undefined && debouncedExclusion !== rowState.exclusion.toString()) {
                        updateCell(rowIndex, 'exclusionAmountFrom', Number(debouncedExclusion));
                        updateCell(rowIndex, 'exclusionAmountTo', rowState.exclusionAmountTo);
                        updateCell(rowIndex, 'qty', rowState.qty);
                        updateCell(rowIndex, 'satuan', rowState.satuan);
                        updateCell(rowIndex, 'satuanIDR', rowState.satuanIDR);
                        updateCell(rowIndex, 'claimAmount', rowState.claimAmount);
                        updateCell(rowIndex, 'coverAmount', rowState.coverAmount);
                        updateCell(rowIndex, 'excessAmount', rowState.excessAmount);
                    }
                }, [debouncedExclusion]);

                return (
                    <div className="w-[200px]">
                        <input
                            type="number"
                            value={rowState.exclusionAmountFrom}
                            onChange={handleChange}
                            className="w-full border rounded p-1"
                        />
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "exclusionIDR",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="EXCLUSION [IDR]" />
            ),
            cell: ({ row }) => {
                const { datatable } = useAppStore();
                const rowIndex = row.index;
                const exclusionIDRValue = datatable[rowIndex]?.exclusionAmountTo !== undefined
                    ? formatNumberWithSeparator(datatable[rowIndex].exclusionAmountTo)
                    : 0;
                return <div className="w-[200px]">{exclusionIDRValue}</div>;
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "coverIDR",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="COVER [IDR]" />
            ),
            cell: ({ row }) => {
                const { datatable } = useAppStore();
                const rowIndex = row.index;
                const coverValue = datatable[rowIndex]?.coverAmount !== undefined
                    ? formatNumberWithSeparator(datatable[rowIndex].coverAmount)
                    : 0;
                return <div className="w-[200px]">{coverValue}</div>;
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "excessIDR",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="EXCESS [IDR]" />
            ),
            cell: ({ row }) => {
                const { datatable } = useAppStore();
                const rowIndex = row.index;
                const excessIDRValue = datatable[rowIndex]?.excessAmount !== undefined
                    ? formatNumberWithSeparator(datatable[rowIndex].excessAmount)
                    : 0;
                return (
                    <div className="w-[200px]">
                        {excessIDRValue}
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "remark",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="REMARK" />
            ),
            cell: ({ row }) => {
                const [value, setValue] = useState<string>(row.getValue("remark") || '');

                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    setValue(e.target.value);
                };

                return (
                    <div className="w-[200px]">
                        <input
                            type="text"
                            value={value}
                            onChange={handleChange}
                            className="w-full border rounded p-1"
                        />
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "modifiedBy",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="MODIFIED BY" />
            ),
            cell: ({ row }) => (
                <div className="w-[200px]">
                    {row.getValue("modifiedBy")}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "modifiedTime",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="MODIFIED TIME" />
            ),
            cell: ({ row }) => (
                <div className="w-[200px]">
                    {row.getValue("modifiedTime")}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        }
    ];
};