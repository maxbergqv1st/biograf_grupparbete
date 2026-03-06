import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image  from "@/parts/Image"


export default function AspectRatioSquare() {
  return (
     <div className="w-500 max-w-sm">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
         
          className="w-500 h-500 rounded-lg object-cover grayscale dark:brightness-20"
        />
      </AspectRatio>
    </div>
  )
}