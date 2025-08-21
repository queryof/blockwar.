import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Terms and Conditions</h1>
              <p className="text-muted-foreground">Last updated: January 2025</p>
            </div>
          </div>
        </div>

        <Card className="bg-card border border-border p-8 max-w-4xl mx-auto">
          <div className="prose prose-neutral max-w-none">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-primary text-sm font-bold">1</span>
              </div>
              Acceptance of Terms
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              By accessing and using the BLOCKWAR store, you accept and agree to be bound by the terms and provision of
              this agreement.
            </p>

            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-primary text-sm font-bold">2</span>
              </div>
              Purchase Terms
            </h2>
            <div className="text-muted-foreground mb-6 space-y-3 leading-relaxed">
              <p>• All purchases are final and non-refundable unless otherwise stated in our Refund Policy.</p>
              <p>
                • Items purchased will be delivered to your Minecraft account within 1-20 minutes of successful payment.
              </p>
              <p>• You must provide a valid Minecraft username for item delivery.</p>
              <p>• Prices are subject to change without notice.</p>
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-primary text-sm font-bold">3</span>
              </div>
              Account Responsibility
            </h2>
            <div className="text-muted-foreground mb-6 space-y-3 leading-relaxed">
              <p>• You are responsible for maintaining the security of your account.</p>
              <p>• You must not share your account credentials with others.</p>
              <p>• Any activity under your account is your responsibility.</p>
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-primary text-sm font-bold">4</span>
              </div>
              Server Rules and Conduct
            </h2>
            <div className="text-muted-foreground mb-6 space-y-3 leading-relaxed">
              <p>• Players must follow all server rules and guidelines.</p>
              <p>• Violation of server rules may result in loss of purchased items without refund.</p>
              <p>• Cheating, hacking, or exploiting will result in permanent ban and forfeiture of all purchases.</p>
              <p>• Harassment, spam, or inappropriate behavior is strictly prohibited.</p>
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-primary text-sm font-bold">5</span>
              </div>
              Virtual Items
            </h2>
            <div className="text-muted-foreground mb-6 space-y-3 leading-relaxed">
              <p>• All purchased items are virtual and have no real-world value.</p>
              <p>• Items are tied to the BLOCKWAR server and cannot be transferred to other servers.</p>
              <p>• We reserve the right to modify or remove items as needed for game balance.</p>
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-primary text-sm font-bold">6</span>
              </div>
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              BLOCKWAR and its operators shall not be liable for any direct, indirect, incidental, special, or
              consequential damages resulting from the use or inability to use our services.
            </p>

            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-primary text-sm font-bold">7</span>
              </div>
              Changes to Terms
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting
              to this page.
            </p>

            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-primary text-sm font-bold">8</span>
              </div>
              Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these terms, please contact us at: contact@blockwar.exoo.cloud
            </p>
          </div>
        </Card>
      </div>

      <StoreFooter />
    </div>
  )
}
