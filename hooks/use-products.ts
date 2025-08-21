"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  weekly_price?: number | null
  currency: string
  category: string
  gamemode: string
  image_url: string | null
  perks_html: string | null
  is_popular: boolean
  is_active: boolean
  sort_order: number
  metadata: any
  created_at: string
  updated_at: string
}

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)

        if (!supabase) {
          console.warn("Supabase client not available, using mock data")
          // Return mock data for development
          setProducts([])
          return
        }

        let query = supabase.from("products").select("*").eq("is_active", true).order("sort_order", { ascending: true })

        if (category) {
          query = query.eq("category", category)
        }

        const { data, error: fetchError } = await query

        if (fetchError) {
          throw fetchError
        }

        setProducts(data || [])
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  return { products, loading, error }
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true)
        setError(null)

        if (!supabase) {
          console.warn("Supabase client not available, using mock data")
          // Return mock data for development
          setProducts([])
          return
        }

        // Get popular products and top products from each category
        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .or("is_popular.eq.true,sort_order.lte.2")
          .order("is_popular", { ascending: false })
          .order("sort_order", { ascending: true })
          .limit(6)

        if (fetchError) {
          throw fetchError
        }

        setProducts(data || [])
      } catch (err) {
        console.error("Error fetching featured products:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch featured products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return { products, loading, error }
}
