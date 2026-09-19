"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { Product, Review } from "@/types";
import {
  MapPin,
  Calendar,
  Star,
  Tag,
  Cpu,
  User,
  MessageSquare,
  ChevronRight,
  Eye,
  Send,
  Lock,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";

const SERVER_URL = "/api/backend";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [buying, setBuying] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [imageGallery, setImageGallery] = useState<string[]>([]);

  useEffect(() => {
    async function loadProductDetails() {
      setLoading(true);
      try {
        const res = await fetch(`${SERVER_URL}/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          
          if (data.product) {
            setSelectedImage(data.product.imageUrl);
            setImageGallery([
              data.product.imageUrl,
              "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=500&q=80",
              "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80",
            ]);
          }
        } else {
          toast.error("Product listing not found");
          router.push("/products");
        }
      } catch (err) {
        console.error("Failed to load details:", err);
        toast.error("Failed to connect to backend server");
      } finally {
        setLoading(false);
      }
    }
    loadProductDetails();
  }, [id]);

  const handleBuy = async () => {
    if (!session) {
      toast.error("Please login to buy this gadget.");
      router.push("/signin");
      return;
    }
    
    if (session.user.id === product?.userId) {
      toast.error("You cannot buy your own product.");
      return;
    }

    setBuying(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/payments/create-gadget-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId: id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to initiate checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong.");
      setBuying(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Review comment cannot be empty");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Review posted successfully!");
        if (product) {
          const updatedReviews = [...(product.reviews || []), data.review];
          setProduct({
            ...product,
            reviews: updatedReviews,
            rating: data.averageRating,
          });
        }
        setReviewComment("");
        setReviewRating(5);
      } else {
        toast.error(data.message || "Failed to post review");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while posting the review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-12 py-6 animate-pulse max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-video bg-slate-200 dark:bg-slate-900 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-900 rounded w-2/3" />
            <div className="h-4 bg-slate-200 dark:bg-slate-900 rounded w-1/3" />
            <div className="h-20 bg-slate-200 dark:bg-slate-900 rounded w-full" />
            <div className="h-10 bg-slate-200 dark:bg-slate-900 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-slate-600 dark:text-slate-400">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Listing Not Found</h2>
        <Link href="/products" className="text-violet-600 dark:text-violet-400 mt-4 inline-block hover:underline font-semibold">
          Return to Explore
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(product.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-12 py-4 max-w-7xl mx-auto px-4">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium flex-wrap">
        <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-400 transition">Home</Link>
        <ChevronRight size={12} className="text-slate-400 dark:text-slate-600" />
        <Link href="/products" className="hover:text-violet-600 dark:hover:text-violet-400 transition">Explore</Link>
        <ChevronRight size={12} className="text-slate-400 dark:text-slate-600" />
        <span className="text-slate-900 dark:text-slate-200 font-bold truncate max-w-[200px]">{product.title}</span>
      </div>

      {/* Main product block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Side: Images Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>
          {/* Gallery Thumbnails */}
          <div className="flex gap-3">
            {imageGallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative h-16 w-24 rounded-xl overflow-hidden border transition bg-slate-50 dark:bg-slate-900 cursor-pointer ${
                  selectedImage === img ? "border-violet-600 ring-2 ring-violet-500/20" : "border-slate-200 dark:border-slate-800 hover:border-violet-400"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Details & Specs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-900/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase border">
                {product.category}
              </span>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border ${
                product.condition === "new"
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900/30"
                  : product.condition === "refurbished"
                  ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900/30"
                  : "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900/30"
              }`}>
                {product.condition} condition
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-tight">
              {product.title}
            </h1>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Brand: <span className="text-slate-900 dark:text-slate-200 font-bold">{product.brand}</span></p>
          </div>

          {/* Pricing Card */}
          <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Selling Price</span>
              <p className="text-3xl font-black text-violet-600 dark:text-violet-400">${product.price.toLocaleString()}</p>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-1.5 justify-end bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full text-amber-500 dark:text-amber-400 text-xs font-bold w-fit ml-auto shadow-sm">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)} Stars</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Based on {product.reviews?.length || 0} customer reviews</p>
            </div>
          </div>
          
          {/* Purchase Action Button */}
          {product.status === "sold" ? (
            <button disabled className="w-full py-4 rounded-xl font-bold text-sm bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed uppercase tracking-wider border border-slate-300 dark:border-slate-700">
              Item Sold Out
            </button>
          ) : (
            <button 
              onClick={handleBuy}
              disabled={buying}
              className="w-full py-4 rounded-xl font-black text-sm bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {buying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Buy with Escrow
                </>
              )}
            </button>
          )}

          {/* Metadata Row */}
          <div className="grid grid-cols-3 gap-4 border-y border-slate-200 dark:border-slate-800 py-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-violet-600 dark:text-violet-400" />
              <div>
                <span className="block text-[9px] text-slate-500 uppercase font-bold">Location</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{product.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-violet-600 dark:text-violet-400" />
              <div>
                <span className="block text-[9px] text-slate-500 uppercase font-bold">Listed Date</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{formattedDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-violet-600 dark:text-violet-400" />
              <div>
                <span className="block text-[9px] text-slate-500 uppercase font-bold">Views</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{product.views || 0} times</span>
              </div>
            </div>
          </div>

          {/* Seller Metadata Info */}
          <div className="flex items-center gap-3 bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/20 p-4 rounded-xl text-xs">
            <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white uppercase shadow-sm flex-shrink-0">
              <User size={16} />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Listed By Seller</span>
              <p className="font-bold text-slate-900 dark:text-slate-200">{product.userName || "Verified Merchant"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Subsections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Description & Specs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Description Block */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2.5 uppercase tracking-wide">
              Product Overview
            </h2>
            <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-semibold">
              {product.shortDescription}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Specifications Block */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2.5 uppercase tracking-wide flex items-center gap-2">
              <Cpu size={18} className="text-violet-600 dark:text-violet-400" />
              <span>Key Specifications</span>
            </h2>
            {product.specifications && product.specifications.length > 0 ? (
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/20">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-3 p-3.5 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-400 capitalize">{spec.key}</span>
                    <span className="col-span-2 text-slate-900 dark:text-slate-200 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No detailed hardware specifications listed for this product.</p>
            )}
          </div>
        </div>

        {/* Right Column: Reviews & Ratings */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2.5 uppercase tracking-wide flex items-center gap-2">
              <MessageSquare size={18} className="text-violet-600 dark:text-violet-400" />
              <span>Customer Reviews ({product.reviews?.length || 0})</span>
            </h2>

            {/* Submit Review Form */}
            <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wide">Post a Review</h3>
              
              {currentUser ? (
                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Select Rating</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none transition cursor-pointer"
                        >
                          <Star
                            size={18}
                            className={`${
                              star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Comments</span>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience using this gadget..."
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-violet-500 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none shadow-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl py-2.5 text-xs transition duration-200 shadow-md shadow-violet-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send size={12} />
                    <span>{submittingReview ? "Submitting..." : "Submit Review"}</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <Lock size={20} className="text-slate-400 dark:text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    You must be logged in to write a review.
                  </p>
                  <Link href="/signin">
                    <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10px] font-bold px-4 py-2 rounded-lg cursor-pointer">
                      Log In Account
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, index) => (
                  <div key={index} className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-900 dark:text-slate-200">{review.userName}</span>
                      <span className="text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                      ))}
                      {Array.from({ length: 5 - review.rating }).map((_, i) => (
                        <Star key={i} size={12} className="text-slate-200 dark:text-slate-800" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-4">No customer reviews yet. Share your experience first!</p>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Related Products Section */}
      <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100">Related Gadgets</h2>
          <p className="text-xs text-slate-500 mt-1">Other listed products matching category: {product.category}</p>
        </div>

        {relatedProducts.length === 0 ? (
          <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-center">
            No other products listed in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct._id} product={relProduct} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
