import React from "react";
import { useRouter } from 'next/navigation'
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { ChevronRight } from "lucide-react";

import { Separator } from "@codevs/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { ApplicantType } from "../_service/type";

export default function TestQAInstruction({
  children,
  applicantData,
}: {
  children: React.ReactNode;
  applicantData: ApplicantType;
}) {
  const router = useRouter();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="sm:max-w-[600px] md:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Test Instructions
            </DialogTitle>
            <DialogDescription>
              Please read the following instructions carefully before starting
              the assessment.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="expectations">Expectations</TabsTrigger>
              <TabsTrigger value="submission">Submission</TabsTrigger>
            </TabsList>

            <div className="h-96 w-full overflow-auto rounded-md p-4">
              <TabsContent value="overview" className="space-y-4">
                <h3 className="text-lg font-semibold">UI/UX Test – Mobile E-Commerce App Design (Figma)</h3>
                <p className="text-sm">
                  <strong>Task:</strong> Design a Mobile Shopping Experience for a Small Boutique Store
                </p>
                <p className="text-sm">
                  You are designing a mobile shopping app for a boutique that sells fashion, lifestyle, and home products. 
                  The store wants an elegant, modern app that feels premium yet easy to use.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium">Timeline</h4>
                  <p className="text-sm">We ask that you finish within <strong>5 days</strong>. If you need an extension or run into any issues, please let us know.</p>
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4">
                <h3 className="text-lg font-semibold">Design Requirements</h3>
                <p className="text-sm mb-2">Design the following <strong>5 core screens</strong> in <strong>Figma</strong>:</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">1. Home Screen</h4>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      <li>Featured products, categories, and a search bar</li>
                      <li>Optional: promotional banners (e.g., seasonal sales)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">2. Product Listing / Category Page</h4>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      <li>Product grid or list view</li>
                      <li>Include filtering and sorting (price, popularity, etc.)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">3. Product Details Page</h4>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      <li>Product image carousel</li>
                      <li>Price, description, size/color options</li>
                      <li>&quot;Add to Cart&quot; and &quot;Buy Now&quot; buttons</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">4. Cart / Checkout Preview</h4>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      <li>List of selected items with quantity adjustment</li>
                      <li>Total price, discounts, and a checkout button</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">5. Checkout / Payment Screen</h4>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      <li>Shipping address entry</li>
                      <li>Payment method selection</li>
                      <li>Order summary and place order button</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="expectations" className="space-y-4">
                <h3 className="text-lg font-semibold">What We&apos;re Looking For</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>Mobile-friendly layout and clean design</li>
                  <li>Smooth navigation flow (from browsing to checkout)</li>
                  <li>Intuitive interactions (add to cart, variations, etc.)</li>
                  <li>Consistent use of spacing, typography, and color</li>
                  <li>Thoughtful UX writing (e.g., buttons, messages)</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6">Deliverables</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>Figma file with all 5 screens</li>
                  <li>Use of components and auto-layout where appropriate</li>
                  <li>Short description of design decisions (comments or a slide in Figma)</li>
                  <li>Optional: clickable prototype for navigation</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6">Bonus Points</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>Dark mode variation</li>
                  <li>Empty or loading states</li>
                  <li>Wishlist / Favorites feature</li>
                  <li>Accessibility features (e.g., color contrast, large tap targets)</li>
                </ul>
              </TabsContent>

              <TabsContent value="submission" className="space-y-4">
                <h3 className="text-lg font-semibold">Submit Your Work</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>Once you&apos;re done, please submit your Figma URL to us.</li>
                  <li>Make sure your file is set to allow viewing access.</li>
                </ul>
                <p className="pt-2 text-sm">
                  We look forward to reviewing your design! If you have any
                  questions at all, feel free to reach out.
                </p>
              </TabsContent>
            </div>
          </Tabs>

          <Separator className="my-4" />

          <DialogFooter>
            <DialogClose asChild>
              {applicantData.test_taken ? (
                <Button className="from-teal to-violet bg-gradient-to-r p-0.5 hover:bg-gradient-to-br">
                  <span className="flex items-center justify-center px-4 py-2">
                    <span className="text-lg text-white">
                      Close Instructions
                    </span>
                  </span>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    router.refresh();
                  }}
                  className="from-teal to-violet bg-gradient-to-r p-0.5 hover:bg-gradient-to-br"
                >
                  <span className="flex items-center justify-center px-4 py-2">
                    <span className="flex items-center gap-2 text-lg text-white">
                      Start Test
                      <ChevronRight size={16} />
                    </span>
                  </span>
                </Button>
              )}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}