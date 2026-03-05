import '../globals.css';

export const metadata = {
  title: 'Foresty Academics — Attendance & Institute Management System',
  description:
    'Foresty Academics is the all-in-one institute management platform. Track attendance, manage students, record fees, and generate powerful reports — all in one place.',
  keywords: [
    'institute management',
    'attendance tracking',
    'student management system',
    'school management software',
    'fee management',
    'academic management',
  ],
  authors: [{ name: 'Foresty Academics' }],
  openGraph: {
    title: 'Foresty Academics — Attendance & Institute Management System',
    description:
      'The all-in-one platform for managing your institute — attendance, students, fees, and analytics.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Foresty Academics',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foresty Academics — Attendance & Institute Management System',
    description:
      'The all-in-one platform for managing your institute — attendance, students, fees, and analytics.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
