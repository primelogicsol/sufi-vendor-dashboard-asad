"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DigitalBook {
  id: number;
  title: string;
  author: string;
  description: string;
  genre: string;
  releaseDate: string;
  url: string;
  coverImage: string;
  price: number;
  overviewImages?: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  isDelete?: boolean;
  reviews?: string[];
}

export function DigitalBookCard({ book }: { book: DigitalBook }) {
  return (
    <Card className="group overflow-hidden border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
      {/* Cover Image */}
      <div className="aspect-[4/3] overflow-hidden bg-muted/20 relative">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <span className="text-muted-foreground text-sm">No Cover</span>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title + Author */}
        <div>
          <h3 className="font-semibold line-clamp-1">{book.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">By {book.author}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>

        {/* Genre + Release Date */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {book.genre}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(book.releaseDate).toLocaleDateString()}
          </span>
        </div>

        {/* Price + Availability */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(book.price)}
          </span>
          <Badge variant={book.isAvailable ? "default" : "destructive"} className="text-xs">
            {book.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>

        {/* Download Button */}
        <Button
          asChild
          className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
          size="sm"
        >
          <a href={book.url} target="_blank" rel="noopener noreferrer">
            Download / View
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
