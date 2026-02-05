// "use client";

// import { MapPin, Star, Heart } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import type { PropertyEntity } from "@/domain/entities";

// interface PropertyListingProps {
//   properties: PropertyEntity[];
// }

// export function PropertyListing({ properties }: PropertyListingProps) {
//   return (
//     <div className="max-w-6xl mx-auto px-6 py-12">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-foreground mb-2">Discover Properties</h2>
//         <p className="text-muted-foreground">
//           Explore our curated selection of amazing properties around the world
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {properties.map((property) => (
//           <PropertyCard key={property.id} property={property} />
//         ))}
//       </div>
//     </div>
//   );
// }

// function PropertyCard({ property }: { property: PropertyEntity }) {
//   return (
//     <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg">
//       <div className="relative">
//         {/* Image */}
//         <div className="aspect-square overflow-hidden">
//           <img
//             src={property.images[0] || '/placeholder-property.jpg'}
//             alt={property.title}
//             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//           />
//         </div>
        
//         {/* Heart Button */}
//         <Button
//           variant="ghost"
//           size="icon"
//           className="absolute top-3 right-3 size-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
//         >
//           <Heart className="size-4" />
//         </Button>

//         {/* Superhost Badge */}
//         {property.host?.isSuperhost && (
//           <div className="absolute top-3 left-3">
//             <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
//               Superhost
//             </div>
//           </div>
//         )}
//       </div>

//       <CardContent className="p-4">
//         {/* Location and Rating */}
//         <div className="flex justify-between items-start mb-2">
//           <div className="flex items-center gap-1">
//             <MapPin className="size-4 text-muted-foreground" />
//             <span className="text-sm font-medium text-foreground">
//               {property.location.city}, {property.location.country}
//             </span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Star className="size-4 fill-current text-yellow-500" />
//             <span className="text-sm font-medium">{property.stats?.rating}</span>
//             <span className="text-sm text-muted-foreground">
//               ({property.stats?.reviewCount})
//             </span>
//           </div>
//         </div>

//         {/* Property Title */}
//         <h3 className="font-medium text-foreground mb-1 line-clamp-1">
//           {property.title}
//         </h3>

//         {/* Property Type */}
//         <p className="text-sm text-muted-foreground mb-2">
//           {property.type}
//         </p>

//         {/* Price */}
//         <div className="flex items-baseline gap-1">
//           <span className="font-semibold text-foreground">
//             ${property.pricing.amount.toLocaleString()}
//           </span>
//           <span className="text-sm text-muted-foreground">
//             {property.pricing.currency}/{property.pricing.frequency}
//           </span>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
