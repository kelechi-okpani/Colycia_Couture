"use client";
import React from 'react';

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans relative isolate">
      {/* Reusable Background Watermark */}
        <div className="about-bg-watermark" aria-hidden="true" />


      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 lg:py-22 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black mb-12">
          Return And Privacy Policy
        </h1>

        {/* --- RETURNS SECTION --- */}
        <section className="space-y-8">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-2xl font-semibold text-black uppercase tracking-widest">
              Returns And Exchanges
            </h2>
          </div>

          <div className="grid gap-10">
            <div>
              <h3 className="font-bold text-neutral-900 mb-3">Return Policy</h3>
              <ul className="list-disc ml-5 space-y-2 text-neutral-600 font-light">
                <li>Applicable only if the wrong item is delivered.</li>
                <li>Claims must be made on delivery.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-3">Return Conditions</h3>
              <ul className="list-disc ml-5 space-y-2 text-neutral-600 font-light">
                <li>Returns are accepted within 24 hours after delivery if the wrong item is sent.</li>
                <li>Items must be returned in the exact condition as received.</li>
                <li>Original packaging, tags, and accessories must be intact.</li>
                <li>Any damage or alteration to the item voids the return eligibility.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-3">Exchanges</h3>
              <ul className="list-disc ml-5 space-y-2 text-neutral-600 font-light">
                <li>Exchanges are primarily valid for size replacement.</li>
                <li>Exchanges are subject to the availability of the replacement item.</li>
                <li>If the requested replacement is not available, shoppers can select a different item from a list of provisions made by Colycia Couture.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-3">Delivery Charges</h3>
              <ul className="list-disc ml-5 space-y-2 text-neutral-600 font-light">
                <li>Return shipping costs are the responsibility of the shopper.</li>
                <li>Original delivery charges are non-refundable.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-3">Pick Up Orders</h3>
              <ul className="list-disc ml-5 space-y-2 text-neutral-600 font-light">
                <li>Shoppers must collect their orders from the pickup office on the stipulated date.</li>
                <li>Orders not collected within 7 days of the stipulated pickup date will be considered forfeited and non-refundable.</li>
                <li>Orders are stipulated for pick up after payment is confirmed.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-3">Return Process</h3>
              <ul className="list-disc ml-5 space-y-2 text-neutral-600 font-light">
                <li>Contact Colycia Customer Service within the specified return period to initiate a return.</li>
                <li>Provide the order number, a detailed description of the issue, and photos if necessary.</li>
                <li>Follow the provided instructions to return the item.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-3">Refunds</h3>
              <ul className="list-disc ml-5 space-y-2 text-neutral-600 font-light">
                <li>Refunds will be processed within 3-5 business days after the returned item is received and inspected.</li>
                <li>Refunds will be issued to the original payment method.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- PRIVACY SECTION --- */}
        <section className="mt-20 space-y-8">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-2xl font-semibold text-black uppercase tracking-widest">
              Privacy Policy
            </h2>
          </div>

          <div className="grid gap-10">
            <div>
              <h3 className="font-bold text-neutral-900 mb-3">Privacy And Data Protection Policy</h3>
              <ul className="list-disc ml-5 space-y-2 text-neutral-600 font-light">
                <li>We collect personal details (name, contact, payment info) solely for order fulfillment and service.</li>
                <li>Customer data is securely stored and shared only with delivery partners when necessary.</li>
                <li>Transactions are processed securely; no sensitive financial data is stored.</li>
                <li>Customers may request data updates or deletion via support.</li>
                <li>Customer reviews may be used for marketing or promotional purposes.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-3">Intellectual Property And Branding Policy</h3>
              <ul className="list-disc ml-5 space-y-2 text-neutral-600 font-light">
                <li>All designs, logos, images, and brand assets belong exclusively to Colycia Couture.</li>
                <li>Reproduction or unauthorized use of our materials is strictly prohibited.</li>
                <li>Collaborations or licensing requests must be formally approved via email.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- FOOTER NOTICE --- */}
        <footer className="mt-20 pt-10 border-t border-neutral-100 text-center md:text-left">
          <p className="text-sm text-neutral-500 italic mb-4">
            By shopping with us, you acknowledge and agree to these policies.
          </p>
          <p className="text-base font-medium">
            For further assistance, contact{" "}
            <a href="mailto:Colyciacouture@Gmail.Com" className="text-[#113F85] underline lowercase">
              Colyciacouture@Gmail.Com
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}