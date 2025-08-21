import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { Card } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <StoreHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-400 hover:text-green-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Link>
          <h1 className="text-4xl font-bold text-white">Refund Policy</h1>
          <p className="text-slate-400 mt-2">Last updated: January 2025</p>
        </div>

        <Card className="bg-slate-800 border-slate-700 p-8 max-w-4xl">
          <div className="prose prose-invert max-w-none">
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-red-400 font-bold mb-2">IMPORTANT NOTICE</h3>
                <p className="text-slate-300">
                  All payments are final and non-refundable. Attempting a chargeback or opening a PayPal dispute will
                  result in permanent and irreversible banishment from all of our servers, and other minecraft stores.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">1. No Refund Policy</h2>
            <p className="text-slate-300 mb-6">
              All purchases made on the BLOCKWAR store are final and non-refundable. This policy applies to all virtual
              items, ranks, coins, and other digital products sold through our platform.
            </p>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">2. Delivery Timeframe</h2>
            <div className="text-slate-300 mb-6 space-y-3">
              <p>Payments are taken and secured by Tebex, a world leader in online gaming transactions.</p>
              <p>
                It could take between 1-20 minutes for your purchase to be credited in-game. If you are still not
                credited after this time period, please open a support ticket on our forums with proof of purchase and
                we will look into your issue.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">3. Account Violations</h2>
            <p className="text-slate-300 mb-6">
              If you are banned from BLOCKWAR for breaking our rules, you will lose access to your purchased goods for
              the duration of your ban. The strict "no refund policy" will also remain in place.
            </p>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">4. Chargeback Policy</h2>
            <div className="text-slate-300 mb-6 space-y-3">
              <p>Initiating a chargeback or PayPal dispute will result in:</p>
              <p>• Immediate and permanent ban from all BLOCKWAR servers</p>
              <p>• Loss of all purchased items and ranks</p>
              <p>• Blacklisting from future purchases</p>
              <p>• Potential legal action for fraud</p>
            </div>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">5. Technical Issues</h2>
            <p className="text-slate-300 mb-6">
              If you experience technical issues with item delivery, please contact our support team immediately. We
              will investigate and resolve legitimate technical problems, but this does not constitute grounds for a
              refund.
            </p>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">6. Server Closure</h2>
            <p className="text-slate-300 mb-6">
              In the unlikely event that BLOCKWAR permanently closes, no refunds will be provided for previously
              purchased items. Virtual items have no real-world value and cannot be transferred to other servers.
            </p>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">7. Support Contact</h2>
            <div className="text-slate-300 mb-6 space-y-3">
              <p>For purchase-related issues (NOT refund requests), contact us through:</p>
              <p>• Discord Server: Join our community Discord</p>
              <p>• Email: support@blockwar.exoo.cloud</p>
              <p>• Include your transaction ID and Minecraft username</p>
            </div>

            <div className="bg-orange-900/20 border border-orange-500 rounded-lg p-4">
              <h3 className="text-orange-400 font-bold mb-2">Before You Purchase</h3>
              <p className="text-slate-300">
                Please carefully consider your purchase before completing the transaction. By purchasing any item from
                our store, you acknowledge that you have read and agree to this refund policy.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <StoreFooter />
    </div>
  )
}
