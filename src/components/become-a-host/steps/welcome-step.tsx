import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/constant/app.constant";
import { DollarSign, Home, MapPin } from "lucide-react";
import { Fragment } from "react";

interface WelcomeStepProps {
  onStart: () => void;
}

export const WelcomeStep = ({ onStart }: WelcomeStepProps) => {
  const steps = [
    {
      number: 1,
      title: "Tell us about your place",
      description:
        "Share some basic info, such as where it is and how many guests can stay.",
      icon: Home,
    },
    {
      number: 2,
      title: "Make it stand out",
      description:
        "Add 5 or more photos plus a title and description - we'll help you out.",
      icon: MapPin,
    },
    {
      number: 3,
      title: "Finish up and publish",
      description:
        "Choose a starting price, verify a few details, then publish your listing.",
      icon: DollarSign,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="w-full  mx-auto px-6 lg:px-16 3xl:px-56 3xl:py-10 min-h-0 flex-1 grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-center">
        {/* Left Column - Intro Text */}
        <div className="h-full flex flex-col items-center justify-center w-full max-w-7xl pb-20">
          <h1 className="text-[clamp(1.75rem,4vw,3rem)] font-bold text-foreground leading-[1.15] flex flex-col">
            <span>It&apos;s easy to get</span>
            <span>
              started on{" "}
              <span className="text-primary uppercase">{APP_NAME}</span>.
            </span>
          </h1>
        </div>

        {/* Right Column - Steps */}
        <div className="h-full flex justify-between gap-0 items-center">
          <div className="w-1/3 h-full " />

          <div className="flex flex-col space-y-6 lg:space-y-8 3xl:space-y-16 h-full py-10 ">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Fragment key={step.number}>
                  <div key={step.number} className="flex gap-6 pb-10">
                    {/* Step Number */}
                    <div className="shrink-0">
                      <span className="text-base lg:text-xl font-bold text-foreground">
                        {step.number}
                      </span>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 space-y-1">
                      <h3 className="text-base lg:text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-md tracking-tighter lg:text-base text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Icon/Illustration */}
                    <div className="shrink-0 w-8 h-8 lg:w-12 lg:h-12 flex items-center justify-center">
                      <div className="w-full h-full rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                        <Icon className="size-4 lg:size-6 text-primary" />
                      </div>
                    </div>
                  </div>

                  {step.number !== steps.length && <Separator />}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer with Get Started Button */}
      <div className="shrink-0 border-t border-border mt-auto">
        <div className="px-6 lg:px-16 py-6 flex justify-end">
          <Button
            onClick={onStart}
            size="sm"
            className="bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 px-8 py-6 text-sm md:text-md lg:text-md 3xl:text-lg font-medium"
          >
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
};
