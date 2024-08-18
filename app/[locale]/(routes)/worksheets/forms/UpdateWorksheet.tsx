"use client";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  initialData: any;
  openEdit: (value: boolean) => void;
};

const UpdateWorksheetForm = ({ initialData, openEdit }: Props) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Radio button state currency
  const [idrbi, setIdrBi] = useState(0);
  const [idroanda, setIdrOanda] = useState(0);
  const [idrmifx, setIdrMifx] = useState(0);
  const [idrtv, setIdrTv] = useState(0);
  const [idrmanual, setIdrManual] = useState(0);

  const router = useRouter();
  const { toast } = useToast();

  const formSchema = z.object({
    id: z.number(),
    dob: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date format"
    }),
    insuranceNumber: z.string(),
    polisNumber: z.string(),
    memberNumber: z.string(),
    cardNumber: z.string(),
    memberName: z.string(),
    plafon: z.number(),
    paid: z.number(),
    noPks: z.string(),
    claimStatus: z.number(),
    limitAvailable: z.number(),
    dateBegin: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date format"
    }),
    dateEnd: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date format"
    }),
    claimNo: z.string(),
    customerName: z.string(),
    customerCode: z.string(),
    holdingName: z.string(),
    holdingCode: z.string(),
    planDetailCode: z.string(),
    planNameDetail: z.string(),
    paketCode: z.string(),
    paketName: z.string(),
    providerCode: z.string(),
    providerName: z.string(),
    claimDate: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date format"
    }),
    admisionDate: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date format"
    }),
    dischargeDate: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date format"
    }),
    claimType: z.string(),
    remark: z.string(),
    totalPaid: z.number(),
    totalExcess: z.number(),
    totalClaim: z.number(),
    lastStatus: z.string(),
    currency_from: z.string(),
    exchangeRateSource: z.string()
  });

  type NewAccountFormValues = z.infer<typeof formSchema>;

  const form = useForm<NewAccountFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsLoading(true);
      setError(null);

      const from = form.watch("currency_from");
      const source = form.watch("exchangeRateSource");

      console.log("Fetching exchange rate for", { from, source });

      if (!from || !source) {
        console.log("Missing required data for API call");
        setIsLoading(false);
        return;
      }

      try {
        let response;
        switch (source) {
          case "tradingview":
            response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
            break;
          default:
            console.warn("Unknown exchange rate source");
            setIsLoading(false);
            return;
        }

        console.log("API response:", response.data.rates.IDR);
        setIdrTv(response.data.rates.IDR);

        if (response?.data?.rates && response.data.rates.IDR) {
          setExchangeRate(response.data.rates.IDR);
        } else {
          console.warn("No rate data found in response");
        }
      } catch (err) {
        console.error("Failed to fetch exchange rate:", err);
        setError("Failed to fetch exchange rate. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRate();
  }, [
    form.watch("currency_from"),
    form.watch("exchangeRateSource")
  ]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleClick = async () => {
    const data = form.getValues();

    const selectedCurrency = form.getValues("currency_from");
    const selectedRateSource = form.getValues("exchangeRateSource");
    let selectedRateValue = 0;

    switch (selectedRateSource) {
      case "bankIndonesia":
        selectedRateValue = idrbi;
        break;
      case "oanda":
        selectedRateValue = idroanda;
        break;
      case "mifx":
        selectedRateValue = idrmifx;
        break;
      case "tradingview":
        selectedRateValue = idrtv;
        break;
      case "manual":
        selectedRateValue = idrmanual;
        break;
      default:
        selectedRateValue = 0;
        break;
    }

    const queryParams = new URLSearchParams({
      cardNumber: data.cardNumber,
      claimNo: data.claimNo,
      currency: selectedCurrency,
      rateValue: selectedRateValue.toString()
    }).toString();

    const url = `/en/worksheets/details?${queryParams}`;

    router.push(url);
  };

  return (
    <div className="flex w-full py-5">
      <Form {...form}>
        <div className="h-full w-full space-y-3">
          <div className="flex flex-col space-y-3">
            <FormField
              control={form.control}
              name="claimNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Claim ID</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-3">
              <FormField
                control={form.control}
                name="currency_from"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>From</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>{field.value ? field.value.toUpperCase() : "Select Currency"}</SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="select">Select Currency</SelectItem>
                        <SelectItem value="sgd">SGD</SelectItem>
                        <SelectItem value="myr">MYR</SelectItem>
                        <SelectItem value="idr">IDR</SelectItem>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="thb">THB</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-1/2 mt-2">
                <FormLabel>To</FormLabel>
                <Input
                  disabled
                  value="IDR"
                />
              </div>
            </div>
          </div>
          <FormField
            control={form.control}
            name="exchangeRateSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exchange Rate Source</FormLabel>
                <FormControl>
                  <div className="flex flex-col space-y-2">

                    <div className="flex items-center">
                      <label className="flex items-center flex-grow space-x-2">
                        <input
                          type="radio"
                          value="tradingview"
                          checked={field.value === "tradingview"}
                          onChange={field.onChange}
                        />
                        <span>Tradingview</span>
                      </label>
                      <Input
                        className="ml-2 w-1/2"
                        value={idrtv}
                        readOnly
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center flex-grow space-x-2">
                        <input
                          type="radio"
                          value="manual"
                          checked={field.value === "manual"}
                          onChange={field.onChange}
                        />
                        <span>Manual</span>
                      </label>
                      <Input
                        className="ml-2 w-1/2"
                        value={idrmanual}
                        onChange={(e) => setIdrManual(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end space-x-2 pt-2">
            <DialogTrigger asChild>
              <Button variant={"destructive"}>Cancel</Button>
            </DialogTrigger>
            <Button
              type="button"
              onClick={handleClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="animate-spin" />
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UpdateWorksheetForm;
