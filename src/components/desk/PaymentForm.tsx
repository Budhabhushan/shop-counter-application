/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "@/src/lib/validation";
import { z } from "zod";

type FormValues = z.input<typeof paymentSchema>;
export default function PaymentForm() {
  const [preview, setPreview] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      email: "",
      sku: "lamp",
      externalChargeId: "",
      extraCode: null,
    },
  });
  const selectedSku = watch("sku");

  async function handlePreview(values: FormValues) {
    setMessage("");

    const response = await fetch("/api/payments/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    console.log("data", data);

    if (!response.ok) {
      setMessage(JSON.stringify(data.errors));
      setPreview(null);
      return;
    }
  }
  async function handleRecord(values: FormValues) {
    setMessage("");

    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    console.log("data", data);
    if (!response.ok) {
      setMessage(JSON.stringify(data.errors));
      return;
    }
    setPayments((prev) => {
      if (data.replayed) {
        return prev;
      }
      return [...prev, data.payment];
    });
    setMessage(data.replayed ? "Payment already recorded" : "Payment recorded");

    setPreview(null);
  }
  return (
    <div className="space-y-8">
      <form className="space-y-4 rounded-xl border p-6">
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            {...register("email")}
            className="block w-full rounded border p-2"
          />
          <p role="alert">{errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor="sku">Item</label>
          <select
            id="sku"
            {...register("sku", {
              onChange: (e) => {
                if (e.target.value === "lamp") {
                  setValue("extraCode", null);
                }
              },
            })}
            className="block w-full rounded border p-2"
          >
            <option value="lamp">Maple Lamp</option>
            <option value="stool">Cedar stool</option>
          </select>
        </div>
        <div>
          <label htmlFor="extraCode">Extra</label>
          <select
            id="extraCode"
            {...register("extraCode")}
            disabled={selectedSku !== "stool"}
            className="block w-full rounded border p-2"
          >
            <option value="">None</option>
            <option value="cushion">Cushion</option>
          </select>
        </div>
        <div>
          <label htmlFor="externalChargeId">Charge id</label>
          <input
            id="externalChargeId"
            {...register("externalChargeId")}
            className="block w-full rounded border p-2"
          />
          <p role="alert">{errors.externalChargeId?.message}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit(handlePreview)}
            className="rounded bg-gray-600 px-5 py-2"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={handleSubmit(handleRecord)}
            className="rounded bg-blue-600 px-5 py-2 text-white"
          >
            Record Payment
          </button>
        </div>
      </form>
      {message && <p role="status">{message}</p>}
      {preview && (
        <section aria-label="Payment preview" className="rounded-xl border p-5">
          <h2 className="text-xl font-bold">Payment preview</h2>
          <p>Email: {preview?.email}</p>
          <p>Item: {preview.itemName}</p>
          <p>Extra: {preview.extraName ?? "None"}</p>
          <p>Total: ${preview.totalCents / 100}</p>
          <p>
            Remaining after: {preview.remainingAfter ?? "Not stock-limited"}
          </p>
        </section>
      )}
      <section>
        <h2 className="text-xl font-bold">Payment queue</h2>
        {payments.length === 0 ? (
          <p>No payments recorded</p>
        ) : (
          payments.map((payment, index) => (
            <div key={`${payment.externalChargeId}-${index}`}>
              <p>{payment?.email}</p>
              <p>{payment.itemName}</p>
              <p>${payment.totalCents / 100}</p>
              <p>Total: ${payment.externalChargeId}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
