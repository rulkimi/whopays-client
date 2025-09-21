// Import all avatar images
import angry_male_avatar from "@/app/assets/friend-avatar/angry_male_avatar.png";
import happy_female_avatar from "@/app/assets/friend-avatar/happy_female_avatar.png";
import masked_male_avatar from "@/app/assets/friend-avatar/masked_male_avatar.png";
import nerd_female_avatar from "@/app/assets/friend-avatar/nerd_female_avatar.png";
import office_male_avatar from "@/app/assets/friend-avatar/office_male_avatar.png";
import retro_male_avatar from "@/app/assets/friend-avatar/retro_male_avatar.png";
import shy_female_avatar from "@/app/assets/friend-avatar/shy_female_avatar.png";
import spiderman_male_avatar from "@/app/assets/friend-avatar/spiderman_male_avatar.png";
import student_female_avatar from "@/app/assets/friend-avatar/student_female_avatar.png";
import stylish_male_avatar from "@/app/assets/friend-avatar/stylish_male_avatar.png";
import { StaticImageData } from "next/image";

export interface AvatarOption {
  id: string;
  name: string;
  src: StaticImageData;
}

export const avatarOptions: AvatarOption[] = [
  { id: "angry_male", name: "Angry Male", src: angry_male_avatar },
  { id: "happy_female", name: "Happy Female", src: happy_female_avatar },
  { id: "masked_male", name: "Masked Male", src: masked_male_avatar },
  { id: "nerd_female", name: "Nerd Female", src: nerd_female_avatar },
  { id: "office_male", name: "Office Male", src: office_male_avatar },
  { id: "retro_male", name: "Retro Male", src: retro_male_avatar },
  { id: "shy_female", name: "Shy Female", src: shy_female_avatar },
  { id: "spiderman_male", name: "Spiderman Male", src: spiderman_male_avatar },
  { id: "student_female", name: "Student Female", src: student_female_avatar },
  { id: "stylish_male", name: "Stylish Male", src: stylish_male_avatar },
];

export const getAvatarById = (id: string): AvatarOption | undefined => {
  return avatarOptions.find((avatar) => avatar.id === id);
};
