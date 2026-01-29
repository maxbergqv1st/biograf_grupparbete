import { useStateContext } from '../utils/useStateObject';

// an image component that automatically switches to black and white
// by adding the css class 'bw' if bwImages is true in our context
export default function Image(props: any) {
  const [{ bwImages }] = useStateContext();
  const { alt, ...rest } = props;
  const className = [
    rest.className,
    "w-full rounded-lg border border-border shadow-sm",
    bwImages ? "bw" : null,
  ]
    .filter(Boolean)
    .join(" ");
  return <img {...rest} alt={alt ?? ""} className={className} />;
}
