"use client";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Minus, Plus, Users } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface GuestCount {
    adults: number;
    children: number;
    infants: number;
}

interface GuestSelectorProps {
    value?: GuestCount;
    onChange?: (guestCount: GuestCount) => void;
    maxGuests?: number;
    className?: string;
    showUserIcon?: boolean
}

export function GuestSelector({ 
    value = { adults: 1, children: 0, infants: 0 },
    onChange,
    maxGuests = 16,
    className,
    showUserIcon = true
}: GuestSelectorProps) {
    const [guestCount, setGuestCount] = React.useState<GuestCount>(value);

    const updateGuestCount = (type: keyof GuestCount, delta: number) => {
        const newCount = { ...guestCount };
        newCount[type] = Math.max(0, Math.min(maxGuests, guestCount[type] + delta));
        
        // Ensure at least one adult
        if (type === 'adults' && newCount.adults === 0) {
            newCount.adults = 1;
            return;
        }
        
        // Check total guests limit
        const totalGuests = newCount.adults + newCount.children;
        if (totalGuests > maxGuests) {
            return;
        }
        
        setGuestCount(newCount);
        onChange?.(newCount);
    };

    const totalGuests = guestCount.adults + guestCount.children;
    let displayText = totalGuests === 1 ? "1 guest" : `${totalGuests} guests`;
    if (guestCount.infants > 0) {
        displayText += `, ${guestCount.infants} infant${guestCount.infants > 1 ? 's' : ''}`;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-between text-left font-normal",
                        className
                    )}
                >
                    <div className="flex items-center gap-2">
                        { showUserIcon && <Users className="size-4" />}
                        <span>{displayText}</span>
                    </div>
                    <div className="w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Adults</div>
                            <div className="text-sm text-muted-foreground">Ages 13 or above</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => updateGuestCount('adults', -1)}
                                disabled={guestCount.adults <= 1}
                            >
                                <Minus className="size-3" />
                            </Button>
                            <span className="w-8 text-center">{guestCount.adults}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => updateGuestCount('adults', 1)}
                                disabled={totalGuests >= maxGuests}
                            >
                                <Plus className="size-3" />
                            </Button>
                        </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Children</div>
                            <div className="text-sm text-muted-foreground">Ages 2-12</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => updateGuestCount('children', -1)}
                                disabled={guestCount.children <= 0}
                            >
                                <Minus className="size-3" />
                            </Button>
                            <span className="w-8 text-center">{guestCount.children}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => updateGuestCount('children', 1)}
                                disabled={totalGuests >= maxGuests}
                            >
                                <Plus className="size-3" />
                            </Button>
                        </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Infants</div>
                            <div className="text-sm text-muted-foreground">Under 2</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => updateGuestCount('infants', -1)}
                                disabled={guestCount.infants <= 0}
                            >
                                <Minus className="size-3" />
                            </Button>
                            <span className="w-8 text-center">{guestCount.infants}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => updateGuestCount('infants', 1)}
                                disabled={guestCount.infants >= 5}
                            >
                                <Plus className="size-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="pt-2 border-t text-xs text-muted-foreground">
                        {maxGuests} guests maximum. Infants don't count toward the number of guests.
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
