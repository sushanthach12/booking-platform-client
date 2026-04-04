"use client";

import type { CheckoutBreakdown } from "@/data/interfaces/booking.repository.interface";
import { getAuthUseCase, getBookingUseCase } from "@/domain/di";
import { differenceInDays } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { BookingConfirmationView } from "./booking-confirmation-view";
import { BookingHeader } from "./booking-header";
import { BookingSteps, type PaymentMethodId } from "./booking-steps";
import { BookingSummaryCard } from "./booking-summary-card";
import { DatePickerModal } from "./modals/date-picker-modal";
import { GuestSelectorModal } from "./modals/guest-selector-modal";
import {
  PriceBreakdownModal,
  type PriceBreakdownLine,
} from "./modals/price-breakdown-modal";
import type { ConfirmAndPayViewProps, GuestCount } from "./types";

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
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingNumber, setBookingNumber] = useState<string | null>(null);

  // Preview state
  const [breakdown, setBreakdown] = useState<CheckoutBreakdown | null>(null);
  const [quoteToken, setQuoteToken] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Modal state
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

  // Fetch price preview on mount and when dates/guests change
  const previewRef = useRef<AbortController | null>(null);
  const fetchPreview = useCallback(async () => {
    if (!checkIn || !checkOut || nights <= 0) return;
    previewRef.current?.abort();
    previewRef.current = new AbortController();

    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const bookingUseCase = getBookingUseCase();
      const result = await bookingUseCase.previewCheckout({
        propertyId: property.id,
        checkIn,
        checkOut,
        guests: guests.adults + guests.children,
      });
      setBreakdown(result.breakdown);
      setQuoteToken(result.quoteToken);
    } catch (err) {
      setPreviewError(
        err instanceof Error ? err.message : "Failed to load price details.",
      );
    } finally {
      setPreviewLoading(false);
    }
  }, [checkIn, checkOut, guests.adults, guests.children, nights, property.id]);

  useEffect(() => {
    void fetchPreview();
    return () => previewRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, guests.adults, guests.children]);

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

  const handleConfirm = useCallback(async () => {
    if (!checkIn || !checkOut) {
      setBookingError("Select check-in and check-out dates.");
      return;
    }
    if (!selectedPayment) {
      setBookingError("Select a payment method.");
      return;
    }
    setBookingError(null);
    setIsSubmitting(true);
    try {
      const bookingUseCase = getBookingUseCase();
      const authUseCase = getAuthUseCase();
      const user = await authUseCase.getCurrentUser();

      const result = await bookingUseCase.confirmBooking({
        propertyId: property.id,
        checkIn,
        checkOut,
        guests: guests.adults + guests.children,
        paymentMethod: selectedPayment,
        quoteToken: quoteToken ?? undefined,
        customerEmail: user?.email,
        customerName: user
          ? `${user.firstName} ${user.lastName}`.trim()
          : undefined,
      });

      if (selectedPayment === "online" && result.paymentLink) {
        // Redirect to Cashfree hosted payment page
        window.location.href = result.paymentLink;
        return;
      }

      // Pay at check-in or no payment link — show confirmation directly
      setBookingNumber(result.bookingNumber);
      setDone(true);
    } catch (err) {
      setBookingError(
        err instanceof Error ? err.message : "Booking failed. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    checkIn,
    checkOut,
    guests.adults,
    guests.children,
    property.id,
    quoteToken,
    selectedPayment,
  ]);

  // Price values — use breakdown from API if available, else fallback to property pricing
  const pricePerNight = breakdown?.basePricePerNight ?? property.pricing.amount;
  const baseAmount = breakdown?.subtotal ?? pricePerNight * nights;
  const cleaningFee = breakdown?.cleaningFee ?? 0;
  const serviceFee = breakdown?.serviceFee ?? 0;
  const taxesAmount = breakdown?.taxAmount ?? 0;
  const totalDiscount = breakdown?.totalDiscount ?? 0;
  const grandTotal = breakdown?.grandTotal ?? baseAmount + taxesAmount;

  const completedPaymentLabel = useMemo(() => {
    if (selectedPayment === "online") return "Pay Online (Cashfree)";
    if (selectedPayment === "pay_at_checkin") return "Pay at Check-in";
    return null;
  }, [selectedPayment]);

  const priceBreakdownLines: PriceBreakdownLine[] = useMemo(() => {
    const lines: PriceBreakdownLine[] = [
      {
        label: `₹${pricePerNight.toLocaleString("en-IN", { maximumFractionDigits: 1 })} × ${nights} nights`,
        value: baseAmount,
      },
    ];
    if (cleaningFee > 0) {
      lines.push({ label: "Cleaning fee", value: cleaningFee });
    }
    if (serviceFee > 0) {
      lines.push({ label: "Service fee", value: serviceFee });
    }
    if (totalDiscount > 0) {
      lines.push({
        label: "Discount",
        value: -totalDiscount,
        valueClassName: "text-green-600 dark:text-green-400 font-semibold",
      });
    }
    lines.push({ label: "Taxes (18%)", value: taxesAmount });
    return lines;
  }, [
    pricePerNight,
    nights,
    baseAmount,
    cleaningFee,
    serviceFee,
    totalDiscount,
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
          bookingReference={bookingNumber ?? undefined}
        />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10">
        <BookingHeader propertyId={property.id} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-20 items-start">
          {/* Left: accordion steps */}
          <div className="space-y-4">
            {previewError && (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                {previewError} — prices shown may be estimates.
              </div>
            )}
            <BookingSteps
              value={activeStep}
              onValueChange={setActiveStep}
              completedPayment={completedPaymentLabel}
              selectedPaymentId={selectedPayment}
              onSelectPayment={setSelectedPayment}
              onPaymentNext={() => setActiveStep("step-2")}
              cancellationDate={property.cancellationDate}
              agreed={agreed}
              onAgreedChange={setAgreed}
              onConfirm={handleConfirm}
              confirmLoading={isSubmitting}
              confirmError={bookingError}
            />
          </div>

          {/* Right: sticky summary */}
          <div className="lg:sticky lg:top-24 flex-1">
            <BookingSummaryCard
              property={property}
              checkIn={checkIn}
              checkOut={checkOut}
              nights={nights}
              guests={guests}
              baseAmount={baseAmount}
              cleaningFee={cleaningFee}
              serviceFee={serviceFee}
              weeklyDiscount={-totalDiscount}
              taxes={taxesAmount}
              grandTotal={grandTotal}
              currency={currency}
              isLoading={previewLoading}
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
      />
    </div>
  );
}
