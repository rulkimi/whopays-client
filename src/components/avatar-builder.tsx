"use client"

import * as Hair from "@/assets/avatar-builder/hair";
import * as Eyes from "@/assets/avatar-builder/eyes";
import * as Mouth from "@/assets/avatar-builder/mouth";
import * as Head from "@/assets/avatar-builder/head";
import * as Outfit from "@/assets/avatar-builder/outfit";
import * as Accessories from "@/assets/avatar-builder/accesssories";
import Image from "next/image";
import Body from "@/assets/avatar-builder/Body.svg"
import Bg from "@/assets/avatar-builder/Bg.svg"
import { useState } from "react";

// Helper to get options, with "None" only for tabs that allow it
function getOptions(obj: Record<string, { src: string } | string>, tabKey: string, allowNone: boolean = true) {
	const options = Object.entries(obj).map(([key, value]) => ({
		label: key,
		value: typeof value === "string" ? value : (value as { src: string }).src,
	}));
	if (allowNone) {
		return [
			{
				label: "None",
				value: null,
				none: true,
				tabKey,
			},
			...options,
		];
	}
	return options;
}

const TABS = [
	{ key: "hair", label: "Hair" },
	{ key: "eyes", label: "Eyes" },
	{ key: "mouth", label: "Mouth" },
	{ key: "head", label: "Head" },
	{ key: "outfit", label: "Outfit" },
	{ key: "accessories", label: "Accessories" },
];

export default function AvatartBuilder() {
	const accessoriesOptions = getOptions(Accessories, "accessories", true);
	const hairOptions = getOptions(Hair, "hair", true);
	const eyesOptions = getOptions(Eyes, "eyes", false); // No "None" for eyes
	const mouthOptions = getOptions(Mouth, "mouth", false); // No "None" for mouth
	const headOptions = getOptions(Head, "head", false); // No "None" for head
	const outfitOptions = getOptions(Outfit, "outfit", true);

	// Set default for eyes, mouth, head to first option (required)
	const [selectedAccessories, setSelectedAccessories] = useState<string | null>(null);
	const [selectedHair, setSelectedHair] = useState<string | null>(
		hairOptions.length > 0 ? hairOptions[1].value as string : null
	);
	const [selectedEyes, setSelectedEyes] = useState<string | null>(
		eyesOptions.length > 0 ? eyesOptions[0].value as string : null
	);
	const [selectedMouth, setSelectedMouth] = useState<string | null>(
		mouthOptions.length > 0 ? mouthOptions[0].value as string : null
	);
	const [selectedHead, setSelectedHead] = useState<string | null>(
		headOptions.length > 0 ? headOptions[0].value as string : null
	);
	const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);

	const [activeTab, setActiveTab] = useState("hair");

	const [bgColor, setBgColor] = useState("#e0e7ef");

	const tabOptionsMap: Record<
		string,
		{ options: { label: string; value: string | null; none?: boolean }[]; selected: string | null; setSelected: (v: string | null) => void }
	> = {
		accessories: { options: accessoriesOptions, selected: selectedAccessories, setSelected: setSelectedAccessories },
		head: { options: headOptions, selected: selectedHead, setSelected: setSelectedHead },
		hair: { options: hairOptions, selected: selectedHair, setSelected: setSelectedHair },
		eyes: { options: eyesOptions, selected: selectedEyes, setSelected: setSelectedEyes },
		mouth: { options: mouthOptions, selected: selectedMouth, setSelected: setSelectedMouth },
		outfit: { options: outfitOptions, selected: selectedOutfit, setSelected: setSelectedOutfit },
	};

	const currentTab = tabOptionsMap[activeTab];

	return (
		<div className="flex flex-row items-start gap-8 min-h-[80vh]">
			<div className="flex flex-col items-center">
				<div
					className="relative size-52 overflow-hidden rounded-full border-2 flex-shrink-0"
					style={{ backgroundColor: bgColor }}
				>
					{/* This div is the colored background behind the avatar */}
					<div
						className="absolute inset-0 rounded-full z-0"
						style={{ backgroundColor: bgColor }}
					/>
					<Image
						src={Bg}
						alt="Background"
						fill
						className="absolute inset-0 w-full h-full z-0 pointer-events-none"
					/>
					{selectedAccessories && typeof selectedAccessories === "string" && (
						<Image
							src={selectedAccessories}
							alt="Accessories"
							fill
							className="absolute inset-0 w-full h-full z-60 pointer-events-none"
						/>
					)}
					{selectedHair && typeof selectedHair === "string" && (
						<Image
							src={selectedHair}
							alt="Hair"
							fill
							className="absolute inset-0 w-full h-full z-50 pointer-events-none"
						/>
					)}
					{selectedEyes && typeof selectedEyes === "string" && (
						<Image
							src={selectedEyes}
							alt="Eyes"
							fill
							className="absolute inset-0 w-full h-full z-40 pointer-events-none"
						/>
					)}
					{selectedMouth && typeof selectedMouth === "string" && (
						<Image
							src={selectedMouth}
							alt="Mouth"
							fill
							className="absolute inset-0 w-full h-full z-30 pointer-events-none"
						/>
					)}
					{selectedHead && typeof selectedHead === "string" && (
						<Image
							src={selectedHead}
							alt="Head"
							fill
							className="absolute inset-0 w-full h-full z-20 pointer-events-none"
						/>
					)}
					{selectedOutfit && typeof selectedOutfit === "string" && (
						<Image
							src={selectedOutfit}
							alt="Outfit"
							fill
							className="absolute inset-0 w-full h-full z-10 pointer-events-none"
						/>
					)}
					<Image
						src={Body}
						alt="Body"
						fill
						className="absolute inset-0 w-full h-full z-[5] pointer-events-none"
					/>
				</div>
				<div className="mt-4 flex flex-col items-center">
					<label htmlFor="bg-color-picker" className="block text-sm font-medium mb-2">
						Background Color
					</label>
					<input
						id="bg-color-picker"
						type="color"
						value={bgColor}
						onChange={e => setBgColor(e.target.value)}
						className="w-24 h-12 p-0 shadow"
						style={{ cursor: "pointer" }}
						aria-label="Pick background color"
					/>
				</div>
			</div>
			<div className="mb-4 flex-1">
				<div className="flex border-b">
					{TABS.map(tab => (
						<button
							key={tab.key}
							className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors duration-150 ${
								activeTab === tab.key
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-blue-500"
							}`}
							onClick={() => setActiveTab(tab.key)}
							type="button"
						>
							{tab.label}
						</button>
					))}
				</div>
				<div className="mt-4">
					<label className="block text-sm font-medium mb-2">{TABS.find(t => t.key === activeTab)?.label}</label>
					<div className="grid grid-cols-5 gap-2">
						{currentTab.options.map(opt => (
							<button
								key={opt.label}
								type="button"
								onClick={() => currentTab.setSelected(opt.value)}
								className={`border rounded p-1 flex items-center justify-center transition-all duration-150 ${
									currentTab.selected === opt.value
										? "border-blue-500 ring-2 ring-blue-300"
										: "border-gray-200 hover:border-blue-300"
								} ${opt.none ? "bg-gray-50" : ""}`}
								style={{ outline: "none" }}
								aria-label={opt.label}
								disabled={
									// Disable "None" for eyes, mouth, head
									(opt.none && (activeTab === "eyes" || activeTab === "mouth" || activeTab === "head"))
								}
							>
								{opt.none ? (
									<span className="text-xs text-gray-400">None</span>
								) : (
									typeof opt.value === "string" && (
										<Image
											src={opt.value}
											alt={opt.label}
											width={48}
											height={48}
											className="object-contain"
										/>
									)
								)}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}