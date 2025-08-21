import crypto from "crypto"

export function generatePaymentToken(): string {
  // Generate a 25-word token using crypto random bytes
  const words = [
    "alpha",
    "beta",
    "gamma",
    "delta",
    "epsilon",
    "zeta",
    "eta",
    "theta",
    "iota",
    "kappa",
    "lambda",
    "mu",
    "nu",
    "xi",
    "omicron",
    "pi",
    "rho",
    "sigma",
    "tau",
    "upsilon",
    "phi",
    "chi",
    "psi",
    "omega",
    "prime",
    "quantum",
    "nexus",
    "matrix",
    "vector",
    "cipher",
    "phoenix",
    "storm",
    "blade",
    "shadow",
    "crystal",
    "thunder",
    "lightning",
    "fire",
    "ice",
    "wind",
    "earth",
    "water",
    "light",
    "dark",
    "void",
    "star",
    "moon",
    "sun",
    "galaxy",
    "cosmos",
  ]

  const selectedWords: string[] = []
  const usedIndices = new Set<number>()

  for (let i = 0; i < 25; i++) {
    let randomIndex: number
    do {
      randomIndex = crypto.randomInt(0, words.length)
    } while (usedIndices.has(randomIndex))

    usedIndices.add(randomIndex)
    selectedWords.push(words[randomIndex])
  }

  return selectedWords.join("-")
}

export function validatePaymentParams(params: URLSearchParams) {
  const paymentMethod = params.get("paymentMethod")
  const transactionId = params.get("transactionId")
  const paymentAmount = params.get("paymentAmount")
  const paymentFee = params.get("paymentFee")
  const status = params.get("status")

  console.log("[v0] Payment params received:", {
    paymentMethod,
    transactionId,
    paymentAmount,
    paymentFee,
    status,
    allParams: Object.fromEntries(params.entries()),
  })

  const result = {
    paymentMethod,
    transactionId,
    paymentAmount: paymentAmount ? Number.parseFloat(paymentAmount) : null,
    paymentFee: paymentFee ? Number.parseFloat(paymentFee) : null,
    status: status?.toLowerCase(),
    isValid: !!(paymentMethod && transactionId && paymentAmount && status),
  }

  console.log("[v0] Validated payment params:", result)

  return result
}
