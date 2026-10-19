declare module "react-signature-canvas" {
  import * as React from "react";

  export interface SignatureCanvasProps {
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    clearOnResize?: boolean;
    dotSize?: number;
    minWidth?: number;
    maxWidth?: number;
    minDistance?: number;
    backgroundColor?: string;
    penColor?: string;
    velocityFilterWeight?: number;
    onBegin?: () => void;
    onEnd?: () => void;
  }

  export default class SignatureCanvas extends React.Component<SignatureCanvasProps> {
    clear: () => void;
    isEmpty: () => boolean;
    toDataURL: (type?: string, encoderOptions?: number) => string;
    fromDataURL: (dataURL: string) => void;
    getCanvas: () => HTMLCanvasElement;
    getTrimmedCanvas: () => HTMLCanvasElement;
  }
}