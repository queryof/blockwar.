import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <StoreHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-400 hover:text-green-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Link>
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="text-slate-400 mt-2">Last updated: January 2025</p>
        </div>

        <Card className="bg-slate-800 border-slate-700 p-8 max-w-4xl">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-orange-400 mb-4">1. Information We Collect</h2>
            <div className="text-slate-300 mb-6 space-y-3">
              <p>
                <strong>Personal Information:</strong>
              </p>
              <p>• Email address (for purchase receipts and account recovery)</p>
              <p>• Minecraft username (for item delivery)</p>
              <p>• Payment information (processed securely by our payment providers)</p>
              <p>
                <strong>Automatic Information:</strong>
              </p>
              <p>• IP address and location data</p>
              <p>• Browser type and version</p>
              <p>• Usage statistics and preferences</p>
            </div>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">2. How We Use Your Information</h2>
            <div className="text-slate-300 mb-6 space-y-3">
              <p>• Process and fulfill your purchases</p>
              <p>• Send purchase confirmations and receipts</p>
              <p>• Provide customer support</p>
              <p>• Improve our services and user experience</p>
              <p>• Prevent fraud and ensure security</p>
            </div>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">3. Information Sharing</h2>
            <div className="text-slate-300 mb-6 space-y-3">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share information only
                in these cases:
              </p>
              <p>• With payment processors to complete transactions</p>
              <p>• When required by law or legal process</p>
              <p>• To protect our rights and prevent fraud</p>
            </div>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">4. Data Security</h2>
            <p className="text-slate-300 mb-6">
              We implement appropriate security measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method of transmission over the internet is
              100% secure.
            </p>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">5. Cookies and Tracking</h2>
            <div className="text-slate-300 mb-6 space-y-3">
              <p>We use cookies and similar technologies to:</p>
              <p>• Remember your preferences and settings</p>
              <p>• Analyze site usage and improve performance</p>
              <p>• Provide personalized content and advertisements</p>
            </div>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">6. Your Rights</h2>
            <div className="text-slate-300 mb-6 space-y-3">
              <p>You have the right to:</p>
              <p>• Access your personal information</p>
              <p>• Correct inaccurate information</p>
              <p>• Request deletion of your data</p>
              <p>• Opt-out of marketing communications</p>
            </div>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">7. Children's Privacy</h2>
            <p className="text-slate-300 mb-6">
              Our services are not intended for children under 13. We do not knowingly collect personal information from
              children under 13. If you are a parent and believe your child has provided us with personal information,
              please contact us.
            </p>

            <h2 className="text-2xl font-bold text-orange-400 mb-4">8. Contact Us</h2>
            <p className="text-slate-300">
              If you have questions about this Privacy Policy, please contact us at: privacy@blockwar.exoo.cloud
            </p>
          </div>
        </Card>
      </div>

      <StoreFooter />
    </div>
  )
}
