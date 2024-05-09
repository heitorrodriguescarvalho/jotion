interface PreviewLayoutProps {
  children: React.ReactNode
}

export default function PreviewLayout({ children }: PreviewLayoutProps) {
  return <div className="h-full dark:bg-[#1f1f1f]">{children}</div>
}
