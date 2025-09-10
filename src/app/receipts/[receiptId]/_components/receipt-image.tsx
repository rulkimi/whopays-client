"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ZoomIn } from "lucide-react";
import Image from "next/image";

type ReceiptImageProps = {
	receiptUrl: string;
	restaurantName: string;
};

export default function ReceiptImage({ receiptUrl, restaurantName }: ReceiptImageProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* Clickable thumbnail */}
			<div 
				className="mt-6 flex justify-center border-t border-dashed border-gray-300 pt-6 cursor-pointer group"
				onClick={() => setIsOpen(true)}
			>
				<div className="relative">
					<Image
						src={receiptUrl}
						alt="Original Receipt"
            width={100}
            height={100}
						className="rounded-xl max-h-72 w-auto object-contain border border-gray-200 shadow-lg transition-all duration-200 group-hover:shadow-xl group-hover:scale-[1.02]"
						style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
					/>
					{/* Hover overlay */}
					<div className="absolute inset-0 bg-black/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
						<div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
							<ZoomIn className="size-5 text-gray-700" />
						</div>
					</div>
					{/* Click hint */}
					<div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs text-center py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						Click to enlarge
					</div>
				</div>
			</div>

			{/* Full-size dialog */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/95 border-0">
					{/* Header */}
					<div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
						<div className="flex items-center justify-between">
							<h3 className="text-white font-semibold text-lg">
								Receipt - {restaurantName}
							</h3>
							<button
								onClick={() => setIsOpen(false)}
								className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
							>
								<X className="size-5" />
							</button>
						</div>
					</div>

					{/* Image container */}
					<div className="flex items-center justify-center p-6 pt-16 min-h-[60vh]">
						<Image
							src={receiptUrl}
							alt="Original Receipt - Full Size"
              width={100}
              height={100}
							className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
							style={{ 
								maxHeight: "calc(90vh - 120px)",
								boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
							}}
						/>
					</div>

					{/* Footer hint */}
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
						<p className="text-white/70 text-sm text-center">
							Click outside or press ESC to close
						</p>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}