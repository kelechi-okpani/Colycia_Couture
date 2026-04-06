"use client";

import React from 'react';

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans relative isolate">
      {/* Background Watermark Utility */}
      <div className="about-bg-watermark" aria-hidden="true" />

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 lg:py-32 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black mb-12">
          Shipping Deliveries And Pickup
        </h1>

        <div className="space-y-12">
          {/* AVAILABLE ITEMS SECTION */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-100 pb-2">
              Available Items
            </h2>
            <div className="space-y-4 text-neutral-600 font-light leading-relaxed">
              <p>
                Please Allow 3-5 Working Days For Your Order To Be Processed. Keep In Mind That Processing Times Are Separate From The Estimated Delivery Time, Which Is The Time Required To Get Your Order To You.
              </p>
              <p>
                Certain Products May Require An Additional 1-2 Working Days For Processing. During Sales And High-Volume Periods, Processing Times May Extend To 3-7 Working Days. Please Be Aware That Weekends Are Not Considered Working Days.
              </p>
            </div>
          </section>

          {/* DELIVERY TIMES SECTION */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-100 pb-2">
              Delivery Times And Policy
            </h2>
            
            <div className="space-y-8">
              {/* Pick-up */}
              <div className="space-y-2">
                <h3 className="font-bold text-black">1. Pick-Up:</h3>
                <p className="text-neutral-600 font-light leading-relaxed">
                  For Orders Within Abuja, We Offer A Convenient Pick-Up Option At Our Flagship Store In Abuja. You Will Receive Email And Text Notifications, Including Pick-Up Details, As Soon As Your Order Is Ready For Pick-Up.
                </p>
              </div>

              {/* Local Deliveries */}
              <div className="space-y-4">
                <h3 className="font-bold text-black">2. Local Deliveries:</h3>
                
                <div className="pl-4 border-l-2 border-neutral-100 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 uppercase mb-1">Within Abuja:</h4>
                    <p className="text-neutral-600 font-light leading-relaxed">
                      We Offer Same-Day Or Next-Day Delivery For Orders Within Abuja, Subject To Product Availability. You Will Receive Email And Text Notifications, Including Delivery Details, As Soon As Your Order Has Been Dispatched.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 uppercase mb-1">Outside Abuja (Within Nigeria):</h4>
                    <p className="text-neutral-600 font-light leading-relaxed">
                      Delivery Outside Abuja Within Nigeria Takes 3-5 Working Days. You Will Receive Email And Text Notifications, Including Delivery Details, As Soon As Your Order Has Been Dispatched.
                    </p>
                  </div>
                </div>
              </div>

              {/* International Orders */}
              <div className="space-y-4">
                <h3 className="font-bold text-black">International Orders</h3>
                <p className="text-neutral-600 font-light leading-relaxed">
                  For International Orders, Please Expect Delivery Within 5-10 Working Days After The Shipping Date.
                </p>
                <div className="bg-neutral-50 p-6 rounded-sm space-y-3">
                  <h4 className="text-xs font-bold text-black uppercase tracking-tighter">Customs Duties:</h4>
                  <p className="text-sm text-neutral-500 font-light leading-relaxed">
                    Most International Shipments (Outside The US) Are Typically Subject To Duties And Taxes Determined By The Importing Country's Government. Please Note That We Are Unable To Predict Or Incorporate These Charges At The Time Of Checkout, As They Are Outside Our Jurisdiction.
                  </p>
                  <p className="text-sm text-neutral-500 font-light leading-relaxed">
                    To Gain A Clearer Understanding Of These Fees, We Recommend Reaching Out To Your Local Customs Office. Colycia Couture Will Not Assume Responsibility For Any Customs Charges Imposed By Individual Countries Or For Any Potential Delays In Customs Processing.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SHIPPING COSTS SECTION */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-100 pb-2">
              Shipping Costs
            </h2>
            <p className="text-neutral-600 font-light leading-relaxed">
              Shipping Costs Vary Depending On Your Location. Please Proceed To The Checkout Page To Confirm The Exact Cost Of Your Shipment.
            </p>
          </section>
        </div>

        {/* BRANED FOOTER */}
        <footer className="mt-20 pt-10 border-t border-neutral-100 text-center">
          <p className="text-sm tracking-widest text-neutral-400 uppercase">
            Colycia Couture — Abuja, Nigeria
          </p>
        </footer>
      </main>
    </div>
  );
}