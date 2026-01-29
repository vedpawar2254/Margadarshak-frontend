"use client";

import React from "react";
import Button from "../ui/Button";

const PaymentDisclaimer = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Payment Disclaimer</h2>
                    </div>

                    <p className="text-gray-600 mb-6 font-medium">
                        Please read carefully before proceeding with the payment.
                    </p>

                    <div className="space-y-4 mb-8">
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Margdarshak is currently in its pre-registration phase. Payments are accepted manually via QR code and are not processed through a payment gateway or company current account.
                        </p>

                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-900">By making a payment:</p>
                            <ul className="space-y-2">
                                {[
                                    "You acknowledge that the payment is made voluntarily after understanding the service details.",
                                    "You agree to Margdarshak’s Return & Refund Policy.",
                                    "You understand that fees once paid are generally non-refundable, except in specific cases mentioned in the policy.",
                                    "You agree to share the payment confirmation (screenshot / transaction ID) for verification."
                                ].map((item, index) => (
                                    <li key={index} className="flex gap-3 text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-8 italic">
                        Clicking “I Agree & Proceed” confirms your acceptance of the above terms.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            className="flex-1"
                            onClick={onConfirm}
                        >
                            I Agree & Proceed
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDisclaimer;
