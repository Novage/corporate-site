import { P2PVideoDemo } from "p2p-media-loader-demo";

interface P2PVideoDemoWrapperProps {
  streamUrl: string;
  debugToolsEnabled?: boolean;
}

export default function P2PVideoDemoWrapper(props: P2PVideoDemoWrapperProps) {
  return <P2PVideoDemo {...props} />;
}
