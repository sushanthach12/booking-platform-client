"use client";

import { differenceInDays } from "date-fns";
import { Building2, CreditCard } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { BookingConfirmationView } from "./booking-confirmation-view";
import { BookingHeader } from "./booking-header";
import {
  BookingSteps,
  type PaymentMethodId,
  type PaymentOption,
} from "./booking-steps";
import { BookingSummaryCard } from "./booking-summary-card";
import { DatePickerModal } from "./modals/date-picker-modal";
import { GuestSelectorModal } from "./modals/guest-selector-modal";
import {
  PriceBreakdownModal,
  type PriceBreakdownLine,
} from "./modals/price-breakdown-modal";
import type { ConfirmAndPayViewProps, GuestCount } from "./types";

function UpiIcon() {
  return (
    <div className="flex size-9 items-center justify-center rounded-md border border-border bg-background px-2">
      <span className="text-xs font-bold text-green-700">UPI</span>
    </div>
  );
}

export function BookingForm({
  property,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  currency,
}: ConfirmAndPayViewProps) {
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState<GuestCount>(initialGuests);
  const [activeStep, setActiveStep] = useState<string>("step-1");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodId>(null);
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);

  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [tmpDateRange, setTmpDateRange] = useState<DateRange | undefined>({
    from: initialCheckIn,
    to: initialCheckOut,
  });
  const [tmpGuests, setTmpGuests] = useState<GuestCount>(initialGuests);

  const nights = useMemo(
    () => (checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0),
    [checkIn, checkOut],
  );
  const pricePerNight = property.pricing.amount;
  const weeklyDiscountPct = property.weeklyDiscountPct ?? 0;
  const taxesAmount = property.taxes ?? 0;
  const baseAmount = pricePerNight * nights;
  const weeklyDiscount = nights >= 7 ? -(baseAmount * weeklyDiscountPct) : 0;
  const grandTotal = baseAmount + weeklyDiscount + taxesAmount;

  const saveDates = useCallback(() => {
    if (tmpDateRange?.from) setCheckIn(tmpDateRange.from);
    if (tmpDateRange?.to) setCheckOut(tmpDateRange.to);
    setDateModalOpen(false);
  }, [tmpDateRange]);

  const saveGuests = useCallback(() => {
    setGuests(tmpGuests);
    setGuestModalOpen(false);
  }, [tmpGuests]);

  const openDateModal = useCallback(() => {
    setTmpDateRange({ from: checkIn, to: checkOut });
    setDateModalOpen(true);
  }, [checkIn, checkOut]);

  const openGuestModal = useCallback(() => {
    setTmpGuests(guests);
    setGuestModalOpen(true);
  }, [guests]);

  const paymentOptions: PaymentOption[] = useMemo(
    () => [
      {
        id: "upi" as const,
        label: "UPI",
        icon: <UpiIcon />,
      },
      {
        id: "card" as const,
        label: "Credit or debit card",
        icon: <CreditCard className="size-5 text-muted-foreground" />,
        cards: true,
      },
      {
        id: "netbank" as const,
        label: "Net Banking",
        icon: <Building2 className="size-5 text-muted-foreground" />,
      },
    ],
    [],
  );

  const completedPaymentLabel = useMemo(
    () =>
      paymentOptions.find((o: PaymentOption) => o.id === selectedPayment)
        ?.label ?? null,
    [paymentOptions, selectedPayment],
  );

  const priceBreakdownLines: PriceBreakdownLine[] = useMemo(() => {
    const lines: PriceBreakdownLine[] = [
      {
        label: `Base rate — ${nights} nights × ₹${pricePerNight.toLocaleString(
          "en-IN",
          { maximumFractionDigits: 1 },
        )}`,
        value: baseAmount,
      },
    ];
    if (weeklyDiscount < 0) {
      lines.push({
        label: `Weekly stay discount (${Math.round(
          (weeklyDiscountPct ?? 0) * 100,
        )}%)`,
        value: weeklyDiscount,
        valueClassName: "text-green-600 dark:text-green-400 font-semibold",
      });
    }
    lines.push({ label: "Taxes & fees", value: taxesAmount });
    return lines;
  }, [
    nights,
    pricePerNight,
    baseAmount,
    weeklyDiscount,
    weeklyDiscountPct,
    taxesAmount,
  ]);

  const totalFormatted = `₹${Math.abs(grandTotal).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

  if (done) {
    return (
      <div className="bg-background max-h-[90vh]">
        <BookingConfirmationView
          property={property}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
        />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10">
        <BookingHeader propertyId={property.id} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-20 items-start">
          {/* Left: single accordion (step-1 payment, step-2 review) */}
          <div className="space-y-4">
            <BookingSteps
              value={activeStep}
              onValueChange={setActiveStep}
              completedPayment={completedPaymentLabel}
              selectedPaymentId={selectedPayment}
              onSelectPayment={setSelectedPayment}
              currency={currency}
              paymentOptions={paymentOptions}
              card={{
                ...card,
                onNumberChange: (v) => setCard((c) => ({ ...c, number: v })),
                onNameChange: (v) => setCard((c) => ({ ...c, name: v })),
                onExpiryChange: (v) => setCard((c) => ({ ...c, expiry: v })),
                onCvvChange: (v) => setCard((c) => ({ ...c, cvv: v })),
              }}
              upiId={upiId}
              onUpiIdChange={setUpiId}
              onPaymentNext={() => setActiveStep("step-2")}
              cancellationDate={property.cancellationDate}
              agreed={agreed}
              onAgreedChange={setAgreed}
              onConfirm={() => setDone(true)}
            />
          </div>

          {/* Right: summary card */}
          <div className="lg:sticky lg:top-24 flex-1">
            <BookingSummaryCard
              property={property}
              checkIn={checkIn}
              checkOut={checkOut}
              nights={nights}
              guests={guests}
              baseAmount={baseAmount}
              weeklyDiscount={weeklyDiscount}
              taxes={taxesAmount}
              grandTotal={grandTotal}
              currency={currency}
              onChangeDates={openDateModal}
              onChangeGuests={openGuestModal}
              onPriceBreakdown={() => setPriceModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <DatePickerModal
        open={dateModalOpen}
        onOpenChange={setDateModalOpen}
        value={tmpDateRange}
        onValueChange={setTmpDateRange}
        onSave={saveDates}
      />
      <GuestSelectorModal
        open={guestModalOpen}
        onOpenChange={setGuestModalOpen}
        value={tmpGuests}
        onChange={setTmpGuests}
        onSave={saveGuests}
        maxGuests={property.maxGuests ?? 16}
      />
      <PriceBreakdownModal
        open={priceModalOpen}
        onOpenChange={setPriceModalOpen}
        lines={priceBreakdownLines}
        totalLabel={`Total (${currency})`}
        totalValue={totalFormatted}
        tip={
          weeklyDiscount < 0 ? (
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed m-0">
              You save{" "}
              <strong>
                ₹
                {Math.abs(weeklyDiscount).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </strong>{" "}
              with the weekly stay discount. All prices include applicable
              taxes.
            </p>
          ) : undefined
        }
      />
    </div>
  );
}
