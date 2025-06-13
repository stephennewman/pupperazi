import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Appointment - Pupperazi Pet Spa",
  description: "Schedule your pet grooming appointment online. Choose services, select date and time, and book your spot at Pupperazi Pet Spa in Palm Harbor, FL.",
  robots: {
    index: false, // Don't index the booking page
    follow: false,
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 