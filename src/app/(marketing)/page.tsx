import Footer from './_components/Footer'
import Heading from './_components/Heading'
import Heroes from './_components/Heroes'

export default function MarketingPage() {
  return (
    <div className="flex min-h-full flex-col dark:bg-[#1f1f1f]">
      <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center md:justify-start">
        <Heading />
        <Heroes />
      </div>
      <Footer />
    </div>
  )
}
